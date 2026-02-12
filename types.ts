
export enum RoleCategory {
  PRODUCT = 'Product',
  ENGINEERING = 'Engineering',
  DATA = 'Data & AI',
  OPS = 'Ops & Infrastructure',
  GOVERNANCE = 'Governance & Risk',
  DESIGN = 'Design'
}

export enum RACIType {
  R = 'R', // Responsible
  A = 'A', // Accountable
  C = 'C', // Consulted
  I = 'I', // Informed
  NONE = '-'
}

export interface Person {
  id: string;
  name: string;
  title: string;
  canonicalRole: string;
  category: RoleCategory;
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  skills: string[];
  managerId?: string;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface ResponsibilityAssignment {
  personId: string;
  activityId: string;
  raciType: RACIType;
}

export interface OrgGap {
  id: string;
  type: 'missing_role' | 'missing_raci' | 'risk_concentration' | 'redundancy';
  message: string;
  severity: 'high' | 'medium' | 'low';
  context?: string;
}

export type ViewType = 'ingest' | 'org-chart' | 'raci' | 'gaps' | 'tests';

export interface OrgState {
  people: Person[];
  activities: Activity[];
  assignments: ResponsibilityAssignment[];
}

// Database Interfaces matching the SQL migration
export interface DBOrganization {
  id: string;
  name: string;
  owner_user_id: string;
  created_at: string;
}

export interface DBPerson {
  id: string;
  organization_id: string;
  name: string;
  title?: string;
  role_classification?: string;
  seniority?: string;
  source_text?: string;
  manager_id?: string;
  created_at: string;
}

export interface DBActivity {
  id: string;
  organization_id: string;
  name: string;
  category?: string;
  description?: string;
  created_at: string;
}

export interface DBAssignment {
  id: string;
  person_id: string;
  activity_id: string;
  raci_type: RACIType;
  created_at: string;
}
