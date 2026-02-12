
/**
 * Mocking a production Supabase client structure.
 * This reflects the production schema defined in supabase/migrations.
 */

const STORAGE_KEY = 'rolemap_db_simulation';

const initialData = {
  organizations: [
    { id: 'org-1', name: 'Alpha AI Workspace', owner_user_id: 'user@example.com' }
  ],
  memberships: [
    { user_id: 'user@example.com', organization_id: 'org-1', role: 'owner' }
  ],
  people: [],
  activities: [],
  responsibility_assignments: [],
};

const getDB = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialData;
};

const saveDB = (db: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const supabase = {
  auth: {
    signInWithOtp: async ({ email }: { email: string }) => {
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 800));
      return { data: { email }, error: null };
    },
    getUser: () => {
      const user = localStorage.getItem('rolemap_user');
      return user ? { email: user, id: user } : null;
    },
    signOut: () => {
      localStorage.removeItem('rolemap_user');
    }
  },
  from: (table: string) => ({
    select: async () => {
      const db = getDB();
      // Simple multi-tenant filtering mock
      const user = localStorage.getItem('rolemap_user');
      let data = db[table] || [];
      
      // Basic simulation of RLS: filter by org_id if applicable
      if (table === 'people' || table === 'activities') {
        const userOrgs = db.memberships
          .filter((m: any) => m.user_id === user)
          .map((m: any) => m.organization_id);
        data = data.filter((item: any) => userOrgs.includes(item.organization_id));
      }
      
      return { data, error: null };
    },
    insert: async (row: any) => {
      const db = getDB();
      if (!db[table]) db[table] = [];
      const newRow = { ...row, id: row.id || crypto.randomUUID(), created_at: new Date().toISOString() };
      db[table].push(newRow);
      saveDB(db);
      return { data: newRow, error: null };
    },
    update: async (id: string, updates: any) => {
      const db = getDB();
      db[table] = (db[table] || []).map((item: any) => 
        item.id === id ? { ...item, ...updates } : item
      );
      saveDB(db);
      return { error: null };
    },
    delete: async (id: string) => {
      const db = getDB();
      db[table] = (db[table] || []).filter((item: any) => item.id !== id);
      saveDB(db);
      return { error: null };
    }
  })
};
