
import { supabase } from '../supabase';
import { DBActivity } from '../../types';

export const activities = {
  async getByOrg(organizationId: string): Promise<DBActivity[]> {
    const { data, error } = await supabase.from('activities').select();
    if (error) throw error;
    return (data as DBActivity[]).filter(a => a.organization_id === organizationId);
  },

  async create(activity: Omit<DBActivity, 'id' | 'created_at'>): Promise<DBActivity> {
    const { data, error } = await supabase.from('activities').insert(activity);
    if (error) throw error;
    return data as DBActivity;
  },

  async update(id: string, updates: Partial<DBActivity>): Promise<void> {
    const { error } = await supabase.from('activities').update(id, updates);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('activities').delete(id);
    if (error) throw error;
  }
};
