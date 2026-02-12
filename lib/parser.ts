
/**
 * RoleMap Heuristic Parser
 * 
 * Extracts structured person data from raw text using pattern matching.
 * Designed to be lightweight and explainable.
 */

import { CANONICAL_ROLES } from '../constants';

export type SeniorityLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive';

export interface ParsedProfile {
  name: string;
  title: string;
  seniority: SeniorityLevel;
  canonicalRole: string;
  confidence: number;
  skills: string[];
}

const SENIORITY_MAP: Record<string, SeniorityLevel> = {
  vp: 'Executive',
  head: 'Executive',
  director: 'Executive',
  chief: 'Executive',
  lead: 'Lead',
  principal: 'Lead',
  staff: 'Lead',
  senior: 'Senior',
  sr: 'Senior',
  junior: 'Junior',
  jr: 'Junior',
  associate: 'Junior',
};

const ROLE_KEYWORDS: Record<string, string[]> = {
  'Machine Learning Engineer': ['mle', 'machine learning', 'ml engineer', 'ml ops'],
  'Data Scientist': ['data scientist', 'data science', 'analytics'],
  'AI Product Manager': ['product manager', 'pm', 'product lead'],
  'Research Scientist': ['research', 'phd', 'scientist'],
  'Applied AI Engineer': ['applied ai', 'llm engineer', 'ai engineer'],
  'Data Engineer': ['data engineer', 'pipeline', 'etl', 'big data'],
  'AI Platform Engineer': ['platform', 'infrastructure', 'ai infra'],
  'Product Designer': ['designer', 'ux', 'ui', 'product design'],
  'Legal': ['legal', 'counsel', 'compliance', 'privacy'],
  'Data Governance': ['governance', 'policy', 'data privacy'],
  'Responsible AI Specialist': ['safety', 'ethics', 'responsible ai', 'alignment'],
};

export const profileParser = {
  parse(text: string): ParsedProfile {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // 1. Extract Name (Heuristic: First line is often the name)
    const name = lines[0] || 'Unknown Candidate';

    // 2. Extract Title (Heuristic: Look for lines with 'at' or following the name)
    let title = 'Professional';
    if (lines.length > 1) {
      // Common LinkedIn pattern: Name \n Title \n Location
      title = lines[1];
    }

    const titleLower = title.toLowerCase();
    let confidence = 0.5;

    // 3. Seniority Detection
    let seniority: SeniorityLevel = 'Mid';
    for (const [key, level] of Object.entries(SENIORITY_MAP)) {
      if (titleLower.includes(key)) {
        seniority = level;
        confidence += 0.1;
        break;
      }
    }

    // 4. Role Classification
    let canonicalRole = 'Generalist';
    let maxMatches = 0;

    for (const role of CANONICAL_ROLES) {
      const keywords = ROLE_KEYWORDS[role] || [role.toLowerCase()];
      const matches = keywords.filter(kw => titleLower.includes(kw)).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        canonicalRole = role;
      }
    }

    if (maxMatches > 0) confidence += 0.2;

    // 5. Skill Extraction (Simple keyword search)
    const commonSkills = ['python', 'pytorch', 'tensorflow', 'sql', 'llm', 'aws', 'docker', 'kubernetes', 'product', 'strategy'];
    const skills = commonSkills.filter(skill => text.toLowerCase().includes(skill));

    return {
      name,
      title,
      seniority,
      canonicalRole,
      confidence: Math.min(confidence, 1.0),
      skills
    };
  }
};
