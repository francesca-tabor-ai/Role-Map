
import { GoogleGenAI, Type } from "@google/genai";
import { CANONICAL_ROLES } from "../../constants";
import { profileParser } from "../parser";
import { RoleCategory } from "../../types";

export interface ClassificationResult {
  canonicalRole: string;
  category: RoleCategory;
  confidence: number;
  reasoning?: string;
  isFallback?: boolean;
}

export interface IRoleClassifier {
  classify(text: string): Promise<ClassificationResult>;
}

export class HeuristicRoleClassifier implements IRoleClassifier {
  async classify(text: string): Promise<ClassificationResult> {
    const local = profileParser.parse(text);
    return {
      canonicalRole: local.canonicalRole,
      category: RoleCategory.ENGINEERING,
      confidence: local.confidence,
      reasoning: "Categorized using keyword pattern matching.",
      isFallback: true,
    };
  }
}

export class GeminiRoleClassifier implements IRoleClassifier {
  async classify(text: string): Promise<ClassificationResult> {
    // Fix: Instantiate GoogleGenAI right before the API call to ensure valid API key usage.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Classify the following professional profile text into exactly one of our canonical AI organization roles.
      
      Canonical Roles: ${CANONICAL_ROLES.join(", ")}
      
      Profile Text:
      "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            canonicalRole: { 
              type: Type.STRING, 
              enum: CANONICAL_ROLES,
              description: "The best matching role from the provided list." 
            },
            category: { 
              type: Type.STRING, 
              enum: Object.values(RoleCategory),
              description: "Functional cluster the role belongs to." 
            },
            confidence: { 
              type: Type.NUMBER, 
              description: "A score between 0 and 1 indicating classification certainty." 
            },
            reasoning: { 
              type: Type.STRING, 
              description: "Brief explanation for this classification." 
            }
          },
          required: ["canonicalRole", "category", "confidence", "reasoning"]
        }
      }
    });

    try {
      const data = JSON.parse(response.text || "{}");
      return {
        canonicalRole: data.canonicalRole,
        category: data.category as RoleCategory,
        confidence: data.confidence,
        reasoning: data.reasoning,
        isFallback: false
      };
    } catch (e) {
      console.error("Gemini Classification failed, parsing raw text", e);
      throw new Error(`Failed to parse Gemini response`);
    }
  }
}

export class RoleClassifierService implements IRoleClassifier {
  private llmProvider: IRoleClassifier;
  private fallbackProvider: IRoleClassifier;

  constructor(llm: IRoleClassifier, fallback: IRoleClassifier) {
    this.llmProvider = llm;
    this.fallbackProvider = fallback;
  }

  async classify(text: string): Promise<ClassificationResult> {
    if (!text.trim()) {
      throw new Error("Empty input text provided for classification.");
    }

    try {
      return await this.llmProvider.classify(text);
    } catch (error) {
      console.warn("LLM Role Classification failed, falling back to heuristics:", error);
      return await this.fallbackProvider.classify(text);
    }
  }
}

export const roleClassifier = new RoleClassifierService(
  new GeminiRoleClassifier(),
  new HeuristicRoleClassifier()
);
