
-- ROLEMAP INITIAL SCHEMA MIGRATION
-- Multi-tenant SaaS structure for organization mapping and RACI matrices.

-- 1. Custom Types
CREATE TYPE raci_type AS ENUM ('R', 'A', 'C', 'I');
CREATE TYPE membership_role AS ENUM ('owner', 'editor', 'viewer');

-- 2. Organizations
-- Root entity for multi-tenancy.
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Memberships
-- Maps users to organizations with specific permissions.
CREATE TABLE user_organization_memberships (
    user_id UUID NOT NULL REFERENCES auth.users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role membership_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, organization_id)
);

-- 4. People
-- Employees or contractors within an organization.
CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT,
    role_classification TEXT, -- e.g., "AI Product Manager"
    seniority TEXT, -- e.g., "Senior", "Executive"
    source_text TEXT, -- Raw LinkedIn/Resume text stored for audit
    manager_id UUID REFERENCES people(id) ON DELETE SET NULL, -- Self-reference for Org Chart
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Activities
-- Deliverables or milestones to be mapped in the RACI.
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT, -- e.g., "Model Development", "Strategy"
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Responsibility Assignments (RACI)
-- The intersection of People and Activities.
CREATE TABLE responsibility_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    raci_type raci_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Ensure a person only has one RACI type per activity
    UNIQUE (person_id, activity_id)
);

-- 7. Performance Indexes
CREATE INDEX idx_people_organization ON people(organization_id);
CREATE INDEX idx_activities_organization ON activities(organization_id);
CREATE INDEX idx_assignments_person ON responsibility_assignments(person_id);
CREATE INDEX idx_assignments_activity ON responsibility_assignments(activity_id);
CREATE INDEX idx_memberships_user ON user_organization_memberships(user_id);

-- 8. Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsibility_assignments ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies

-- Helper function to check if a user is a member of an organization
CREATE OR REPLACE FUNCTION is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_organization_memberships
        WHERE organization_id = org_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organizations: Users can see organizations they belong to.
CREATE POLICY "Users can view their organizations"
ON organizations FOR SELECT
USING (is_org_member(id));

-- Memberships: Users can see memberships for their own organizations.
CREATE POLICY "Users can view memberships in their org"
ON user_organization_memberships FOR SELECT
USING (is_org_member(organization_id));

-- People: Standard multi-tenant isolation.
CREATE POLICY "Org members can view people"
ON people FOR SELECT
USING (is_org_member(organization_id));

CREATE POLICY "Owners and Editors can manage people"
ON people FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_organization_memberships
        WHERE organization_id = people.organization_id 
        AND user_id = auth.uid() 
        AND role IN ('owner', 'editor')
    )
);

-- Activities: Standard multi-tenant isolation.
CREATE POLICY "Org members can view activities"
ON activities FOR SELECT
USING (is_org_member(organization_id));

CREATE POLICY "Owners and Editors can manage activities"
ON activities FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_organization_memberships
        WHERE organization_id = activities.organization_id 
        AND user_id = auth.uid() 
        AND role IN ('owner', 'editor')
    )
);

-- Responsibility Assignments: Isolation based on the parent Person's organization.
CREATE POLICY "Org members can view assignments"
ON responsibility_assignments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM people
        WHERE people.id = responsibility_assignments.person_id
        AND is_org_member(people.organization_id)
    )
);

CREATE POLICY "Owners and Editors can manage assignments"
ON responsibility_assignments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM people
        JOIN user_organization_memberships ON people.organization_id = user_organization_memberships.organization_id
        WHERE people.id = responsibility_assignments.person_id
        AND user_organization_memberships.user_id = auth.uid()
        AND user_organization_memberships.role IN ('owner', 'editor')
    )
);
