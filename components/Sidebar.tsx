
import React from 'react';
import { ViewType } from '../types';
import { Users, Table, AlertTriangle, FileText, ChevronRight, LogOut, Beaker } from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  userEmail: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, userEmail, onLogout }) => {
  const tabs = [
    { id: 'ingest', name: 'Ingest', icon: FileText },
    { id: 'org-chart', name: 'Team', icon: Users },
    { id: 'raci', name: 'RACI', icon: Table },
    { id: 'gaps', name: 'Health', icon: AlertTriangle },
    { id: 'tests', name: 'Tests', icon: Beaker },
  ];

  return (
    <nav className="w-60 border-r border-slate-200/60 bg-white flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-black shadow-lg">RM</div>
        <h1 className="text-[14px] font-bold text-slate-900 tracking-tight">RoleMap</h1>
      </div>
      <div className="flex-1 py-6 px-3 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id as ViewType)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-md transition-all ${
                isActive ? 'bg-slate-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {tab.name}
            </button>
          );
        })}
      </div>
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2">
          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{userEmail.charAt(0).toUpperCase()}</div>
          <div className="overflow-hidden">
            <p className="text-[12px] font-semibold text-slate-900 truncate leading-none">{userEmail.split('@')[0]}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full mt-2 flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold text-slate-400 hover:text-red-600 transition-all">
          <LogOut className="w-3 h-3" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
