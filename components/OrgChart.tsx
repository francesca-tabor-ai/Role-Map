
import React, { useState } from 'react';
import { Person, RoleCategory } from '../types';
import { ShieldCheck, Mail, Linkedin } from 'lucide-react';
import { PersonCard, SidePanel, Badge } from './DesignSystem';

export const OrgChart: React.FC<{ people: Person[] }> = ({ people }) => {
  const [selected, setSelected] = useState<Person | null>(null);
  const groups = Object.values(RoleCategory);

  return (
    <div className="space-y-16">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Functional Clusters</h2>
        <p className="text-sm text-slate-500">Talent distribution across core AI functions.</p>
      </div>

      <div className="space-y-12">
        {groups.map(group => {
          const members = people.filter(p => p.category === group);
          if (members.length === 0) return null;
          return (
            <div key={group} className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{group}</h3>
                <div className="h-px flex-1 bg-slate-100"></div>
                <span className="text-[11px] font-bold text-slate-300">{members.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {members.map(p => <PersonCard key={p.id} person={p} onClick={() => setSelected(p)} />)}
              </div>
            </div>
          );
        })}
      </div>

      <SidePanel isOpen={!!selected} onClose={() => setSelected(null)} title="Profile intelligence">
        {selected && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white text-2xl font-bold">{selected.name.charAt(0)}</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.title}</p>
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Role</span><Badge variant="indigo">{selected.canonicalRole}</Badge></div>
               <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Level</span><Badge>{selected.seniority}</Badge></div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-6">
              <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold"><Mail className="w-3.5 h-3.5" />Email</button>
              <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50"><Linkedin className="w-3.5 h-3.5" />LinkedIn</button>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
};

export default OrgChart;
