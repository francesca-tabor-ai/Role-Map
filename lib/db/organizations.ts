
import { supabase } from '../supabase';
import { DBOrganization } from '../../types';

export const organizations = {
  async getAll(): Promise<DBOrganization[]> {
    const { data, error } = await supabase.from('organizations').select();
    if (error) throw error;
    return data as DBOrganization[];
  },

  async getById(id: string): Promise<DBOrganization | null> {
    const { data, error } = await supabase.from('organizations').select();
    if (error) throw error;
    return (data as DBOrganization[]).find(org => org.id === id) || null;
  },

  async create(name: string): Promise<DBOrganization> {
    const user = supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.from('organizations').insert({
      name,
      owner_user_id: user.id,
    });
    if (error) throw error;
    return data as DBOrganization;
  },

  async update(id: string, name: string): Promise<void> {
    const { error } = await supabase.from('organizations').update(id, { name });
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('organizations').delete(id);
    if (error) throw error;
  }
};
