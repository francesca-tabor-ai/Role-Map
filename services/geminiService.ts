
import { GoogleGenAI, Type } from "@google/genai";
import { Person, Activity, ResponsibilityAssignment, OrgGap, RoleCategory } from "../types";
import { roleClassifier } from "../lib/ai/classifier";
import { GapDetector } from "../lib/ai/gapDetector";

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000;

async function callGeminiWithRetry(fn: () => Promise<any>, retries = MAX_RETRIES, backoff = INITIAL_BACKOFF): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED');
    if (isRateLimit && retries > 0) {
      console.warn(`Gemini rate limit hit. Retrying in ${backoff}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return callGeminiWithRetry(fn, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export const geminiService = {
  async parseProfile(text: string): Promise<Partial<Person>> {
    const classification = await roleClassifier.classify(text);
    
    return callGeminiWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Extract Name, Title, Seniority (Junior/Mid/Senior/Lead/Executive), and Skills from: "${text}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              title: { type: Type.STRING },
              seniority: { type: Type.STRING, enum: ["Junior", "Mid", "Senior", "Lead", "Executive"] },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "title", "seniority"]
          }
        }
      });

      const basicData = JSON.parse(response.text || '{}');
      return {
        ...basicData,
        canonicalRole: classification.canonicalRole,
        category: classification.category,
      };
    });
  },

  async parseMultipleProfiles(text: string): Promise<Partial<Person>[]> {
    return callGeminiWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Split and extract profile data for all people in this text: "${text}". 
        Map to roles: AI Product Manager, MLE, Data Scientist, Applied AI Engineer, Research Scientist, Data Engineer, Data Annotator, Governance, Backend, Frontend, Platform, DevOps, Designer, Researcher, Responsible AI, Model Risk, Legal.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                canonicalRole: { type: Type.STRING },
                category: { type: Type.STRING, enum: Object.values(RoleCategory) },
                seniority: { type: Type.STRING, enum: ["Junior", "Mid", "Senior", "Lead", "Executive"] },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "title", "canonicalRole", "category", "seniority"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    });
  },

  async suggestRACI(people: Person[], activities: Activity[]): Promise<ResponsibilityAssignment[]> {
    return callGeminiWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const refinedContents = `Map RACI for AI org.
People: ${people.map(p => `${p.id}:${p.canonicalRole}(${p.seniority})`).join(',')}
Activities: ${activities.map(a => `[${a.id}]${a.name}`).join(',')}

Rules:
- Exactly one 'Accountable' (A) per activity (usually Leads/Execs).
- At least one 'Responsible' (R) per activity (usually MLEs/Engineers).
- C/I based on logical collaboration.
Return JSON array: {personId, activityId, raciType:"R"|"A"|"C"|"I"}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: refinedContents,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        personId: { type: Type.STRING },
                        activityId: { type: Type.STRING },
                        raciType: { type: Type.STRING, enum: ["R", "A", "C", "I"] }
                    },
                    required: ["personId", "activityId", "raciType"]
                }
            }
        }
      });

      const rawResults = JSON.parse(response.text || '[]');
      return rawResults.map((r: any) => {
        const person = people.find(p => p.id === r.personId || p.name === r.personId);
        return {
          personId: person ? person.id : r.personId,
          activityId: r.activityId,
          raciType: r.raciType
        };
      }).filter((r: any) => people.some(p => p.id === r.personId) && activities.some(a => a.id === r.activityId));
    });
  },

  async detectGaps(people: Person[], assignments: ResponsibilityAssignment[], activities: Activity[]): Promise<OrgGap[]> {
    const ruleBasedGaps = GapDetector.detectGaps(people, assignments, activities);

    const context = {
        people: people.map(p => ({ id: p.id, role: p.canonicalRole, seniority: p.seniority })),
        assignments: assignments.map(a => ({ pId: a.personId, aId: a.activityId, type: a.raciType })),
        activities: activities.map(a => ({ id: a.id, name: a.name, cat: a.category }))
    };

    return callGeminiWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze AI org for gaps. Deterministic gaps: ${JSON.stringify(ruleBasedGaps.map(g => g.message))}
Team: ${JSON.stringify(context)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['missing_role', 'missing_raci', 'risk_concentration', 'redundancy'] },
                message: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                context: { type: Type.STRING }
              },
              required: ["id", "type", "message", "severity"]
            }
          }
        }
      });

      const aiGaps: OrgGap[] = JSON.parse(response.text || '[]');
      return [...ruleBasedGaps, ...aiGaps];
    });
  }
};
