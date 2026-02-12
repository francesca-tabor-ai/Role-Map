
import { supabase } from './supabase';
import { DBOrganization, DBPerson, DBActivity, DBAssignment, RACIType } from '../types';

export const db = {
  organizations: {
    async getAll(): Promise<DBOrganization[]> {
      const { data, error } = await supabase.from('organizations').select();
      if (error) throw error;
      return data as DBOrganization[];
    },
    async create(name: string): Promise<DBOrganization> {
      const { data, error } = await supabase.from('organizations').insert({ 
        name, 
        owner_user_id: 'user-1' 
      });
      if (error) throw error;
      return data as DBOrganization;
    }
  },
  people: {
    async getByOrg(orgId: string): Promise<DBPerson[]> {
      const { data, error } = await supabase.from('people').select();
      if (error) throw error;
      return (data as DBPerson[]).filter(p => p.organization_id === orgId);
    },
    async create(person: Omit<DBPerson, 'id' | 'created_at'>): Promise<DBPerson> {
      const { data, error } = await supabase.from('people').insert(person);
      if (error) throw error;
      return data as DBPerson;
    },
    async delete(id: string) {
      return supabase.from('people').delete(id);
    }
  },
  activities: {
    async getByOrg(orgId: string): Promise<DBActivity[]> {
      const { data, error } = await supabase.from('activities').select();
      if (error) throw error;
      return (data as DBActivity[]).filter(a => a.organization_id === orgId);
    },
    async create(activity: Omit<DBActivity, 'id' | 'created_at'>): Promise<DBActivity> {
      const { data, error } = await supabase.from('activities').insert(activity);
      if (error) throw error;
      return data as DBActivity;
    }
  },
  assignments: {
    async getByPerson(personId: string): Promise<DBAssignment[]> {
      const { data, error } = await supabase.from('responsibility_assignments').select();
      if (error) throw error;
      return (data as DBAssignment[]).filter(a => a.person_id === personId);
    },
    async upsert(personId: string, activityId: string, raciType: RACIType) {
      const { data: dbData } = await supabase.from('responsibility_assignments').select();
      const existing = (dbData as DBAssignment[]).find(a => a.person_id === personId && a.activity_id === activityId);
      if (existing) {
        return supabase.from('responsibility_assignments').update(existing.id, { raci_type: raciType });
      } else {
        return supabase.from('responsibility_assignments').insert({ 
          person_id: personId, 
          activity_id: activityId, 
          raci_type: raciType 
        });
      }
    },
    async delete(personId: string, activityId: string) {
      const { data: dbData } = await supabase.from('responsibility_assignments').select();
      const existing = (dbData as DBAssignment[]).find(a => a.person_id === personId && a.activity_id === activityId);
      if (existing) return supabase.from('responsibility_assignments').delete(existing.id);
    }
  }
};
