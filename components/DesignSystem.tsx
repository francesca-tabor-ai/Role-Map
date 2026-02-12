
import React from 'react';
import { Person, RoleCategory, RACIType } from '../types';
import { ChevronRight, ShieldCheck, X, CheckCircle2, AlertCircle } from 'lucide-react';

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'indigo' | 'emerald' | 'amber' | 'rose' }> = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-slate-50 text-slate-500 border-slate-200',
    indigo: 'bg-indigo-50/50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

export const ConfidenceBadge: React.FC<{ score: number }> = ({ score }) => (
  <Badge variant={score >= 0.85 ? 'emerald' : score >= 0.6 ? 'amber' : 'rose'}>
    {Math.round(score * 100)}% Match
  </Badge>
);

export const PersonCard: React.FC<{ person: Person; onClick?: () => void }> = ({ person, onClick }) => (
  <button
    onClick={onClick}
    className="group w-full text-left bg-white border border-slate-200/60 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {person.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[13px] font-semibold text-slate-900 truncate leading-tight">{person.name}</h4>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">{person.canonicalRole}</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
    </div>
  </button>
);

export const RaciCell: React.FC<{ value: RACIType; onChange: (val: RACIType) => void; isFocused?: boolean }> = ({ value, onChange, isFocused }) => {
  const styles = {
    [RACIType.R]: 'text-indigo-600 bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/10',
    [RACIType.A]: 'text-white bg-slate-900 border-slate-900 ring-2 ring-slate-900/10',
    [RACIType.C]: 'text-slate-700 bg-slate-50 border-slate-200',
    [RACIType.I]: 'text-slate-400 bg-slate-50/30 border-slate-100',
    [RACIType.NONE]: 'text-slate-200 bg-transparent border-transparent hover:border-slate-200 hover:text-slate-300'
  };
  
  return (
    <div className={`relative group/cell h-full w-full min-h-[64px] flex items-center justify-center transition-all ${isFocused ? 'bg-indigo-500/5' : ''}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as RACIType)}
        className={`w-10 h-10 appearance-none text-center font-black text-[12px] cursor-pointer outline-none rounded-lg border transition-all duration-150 focus:scale-110 active:scale-95 ${styles[value]}`}
      >
        <option value={RACIType.NONE}>-</option>
        <option value={RACIType.R}>R</option>
        <option value={RACIType.A}>A</option>
        <option value={RACIType.C}>C</option>
        <option value={RACIType.I}>I</option>
      </select>
      {value !== RACIType.NONE && (
        <div className="absolute bottom-1 text-[7px] font-black text-slate-300 uppercase tracking-tighter opacity-0 group-hover/cell:opacity-100 transition-opacity">
          {value === RACIType.R ? 'Resp.' : value === RACIType.A ? 'Acc.' : value === RACIType.C ? 'Cons.' : 'Info.'}
        </div>
      )}
    </div>
  );
};

export const SidePanel: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-50" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[60] border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </>
  );
};
