
import { supabase } from '../supabase';
import { DBAssignment, RACIType } from '../../types';

export const assignments = {
  async getByPerson(personId: string): Promise<DBAssignment[]> {
    const { data, error } = await supabase.from('responsibility_assignments').select();
    if (error) throw error;
    return (data as DBAssignment[]).filter(a => a.person_id === personId);
  },

  async getByActivity(activityId: string): Promise<DBAssignment[]> {
    const { data, error } = await supabase.from('responsibility_assignments').select();
    if (error) throw error;
    return (data as DBAssignment[]).filter(a => a.activity_id === activityId);
  },

  async upsert(personId: string, activityId: string, raciType: RACIType): Promise<DBAssignment> {
    // Check if exists
    const db = (await supabase.from('responsibility_assignments').select()).data as DBAssignment[];
    const existing = db.find(a => a.person_id === personId && a.activity_id === activityId);

    if (existing) {
      const { error } = await supabase.from('responsibility_assignments').update(existing.id, { raci_type: raciType });
      if (error) throw error;
      return { ...existing, raci_type: raciType };
    } else {
      const { data, error } = await supabase.from('responsibility_assignments').insert({
        person_id: personId,
        activity_id: activityId,
        raci_type: raciType,
      });
      if (error) throw error;
      return data as DBAssignment;
    }
  },

  async delete(personId: string, activityId: string): Promise<void> {
    const db = (await supabase.from('responsibility_assignments').select()).data as DBAssignment[];
    const existing = db.find(a => a.person_id === personId && a.activity_id === activityId);
    if (existing) {
      const { error } = await supabase.from('responsibility_assignments').delete(existing.id);
      if (error) throw error;
    }
  }
};
