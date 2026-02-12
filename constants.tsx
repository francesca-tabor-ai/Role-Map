
import { Activity, Person, RoleCategory } from './types';

export const CANONICAL_ROLES = [
  'AI Product Manager', 'Technical Product Manager', 'AI Program Manager',
  'Machine Learning Engineer', 'Data Scientist', 'Applied AI Engineer',
  'Research Scientist', 'Data Engineer', 'Data Annotator', 'Data Governance',
  'Backend Engineer', 'Frontend Engineer', 'AI Platform Engineer',
  'DevOps / MLOps Engineer', 'Product Designer', 'UX Researcher',
  'Conversation Designer', 'Responsible AI Specialist', 'Model Risk', 'Legal'
];

export const ACTIVITY_TEMPLATES: Record<string, Activity[]> = {
  'AI Product Delivery': [
    { id: 'act-1', category: 'Product Delivery', name: 'AI Feature PRD & Scoping' },
    { id: 'act-2', category: 'Product Delivery', name: 'AI ROI & Business Case Analysis' },
    { id: 'act-3', category: 'Product Delivery', name: 'User Research for Generative UI' },
    { id: 'act-4', category: 'Product Delivery', name: 'Competitive AI Benchmarking' },
    { id: 'act-5', category: 'Product Delivery', name: 'AI Product Roadmap Definition' },
    { id: 'act-6', category: 'Product Delivery', name: 'Pricing & Token Monetization Strategy' }
  ],
  'Model Development': [
    { id: 'act-7', category: 'Model Development', name: 'Model Architecture Selection' },
    { id: 'act-8', category: 'Model Development', name: 'Fine-tuning & Instruction Tuning' },
    { id: 'act-9', category: 'Model Development', name: 'Prompt Engineering' },
    { id: 'act-10', category: 'Model Development', name: 'Hyperparameter Optimization' },
    { id: 'act-11', category: 'Model Development', name: 'Offline Model Evaluation' },
    { id: 'act-12', category: 'Model Development', name: 'Model Quantization for Edge' },
    { id: 'act-13', category: 'Model Development', name: 'RLHF / DPO Alignment' }
  ],
  'Data Lifecycle': [
    { id: 'act-14', category: 'Data Lifecycle', name: 'Data Acquisition & Sourcing' },
    { id: 'act-15', category: 'Data Lifecycle', name: 'Data Pipeline Engineering (ETL)' },
    { id: 'act-16', category: 'Data Lifecycle', name: 'Labeling & Annotation QC' },
    { id: 'act-17', category: 'Data Lifecycle', name: 'Feature Store Management' },
    { id: 'act-18', category: 'Data Lifecycle', name: 'Data Privacy Masking' },
    { id: 'act-19', category: 'Data Lifecycle', name: 'Vector Database Indexing' },
    { id: 'act-20', category: 'Data Lifecycle', name: 'Synthetic Data Generation' }
  ],
  'Safety & Governance': [
    { id: 'act-21', category: 'Safety & Governance', name: 'Responsible AI Framework' },
    { id: 'act-22', category: 'Safety & Governance', name: 'Model Bias & Fairness Auditing' },
    { id: 'act-23', category: 'Safety & Governance', name: 'Red Teaming & Jailbreak Testing' },
    { id: 'act-24', category: 'Safety & Governance', name: 'AI Regulatory Compliance' },
    { id: 'act-25', category: 'Safety & Governance', name: 'Transparency Reporting' },
    { id: 'act-26', category: 'Safety & Governance', name: 'Adversarial Robustness Testing' },
    { id: 'act-27', category: 'Safety & Governance', name: 'IP & Copyright Review' }
  ],
  'Production Operations': [
    { id: 'act-28', category: 'Production Ops', name: 'MLOps CI/CD Pipeline Setup' },
    { id: 'act-29', category: 'Production Ops', name: 'Inference API Scaling' },
    { id: 'act-30', category: 'Production Ops', name: 'Real-time Latency Monitoring' },
    { id: 'act-31', category: 'Production Ops', name: 'Data & Model Drift Detection' },
    { id: 'act-32', category: 'Production Ops', name: 'GPU Resource Allocation' },
    { id: 'act-33', category: 'Production Ops', name: 'A/B & Shadow Deployment' },
    { id: 'act-34', category: 'Production Ops', name: 'Incident Response for Failures' }
  ]
};

// Fix: Explicitly type MOCK_INITIAL_PEOPLE and use enum values to satisfy Person interface
export const MOCK_INITIAL_PEOPLE: Person[] = [
  {
    id: 'p-1',
    name: 'Sarah Chen',
    title: 'Head of AI Product',
    canonicalRole: 'AI Product Manager',
    category: RoleCategory.PRODUCT,
    seniority: 'Executive',
    skills: ['Strategy', 'LLM', 'Product Management'],
    managerId: undefined
  },
  {
    id: 'p-2',
    name: 'Marcus Thorne',
    title: 'Senior ML Engineer',
    canonicalRole: 'Machine Learning Engineer',
    category: RoleCategory.ENGINEERING,
    seniority: 'Senior',
    skills: ['PyTorch', 'C++', 'Distributed Training'],
    managerId: 'p-1'
  }
];
