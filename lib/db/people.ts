
import { supabase } from '../supabase';
import { DBPerson } from '../../types';

export const people = {
  async getByOrg(organizationId: string): Promise<DBPerson[]> {
    const { data, error } = await supabase.from('people').select();
    if (error) throw error;
    return (data as DBPerson[]).filter(p => p.organization_id === organizationId);
  },

  async create(person: Omit<DBPerson, 'id' | 'created_at'>): Promise<DBPerson> {
    const { data, error } = await supabase.from('people').insert(person);
    if (error) throw error;
    return data as DBPerson;
  },

  async update(id: string, updates: Partial<DBPerson>): Promise<void> {
    const { error } = await supabase.from('people').update(id, updates);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('people').delete(id);
    if (error) throw error;
  }
};
