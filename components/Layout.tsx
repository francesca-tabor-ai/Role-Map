
import React from 'react';
import { ViewType } from '../types';
import { Users, Table, AlertTriangle, FileText, Share2, Settings, Zap } from 'lucide-react';

interface LayoutProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onViewChange, children }) => {
  const tabs = [
    { id: 'ingest', name: 'Ingest', icon: FileText },
    { id: 'org-chart', name: 'Org Chart', icon: Users },
    { id: 'raci', name: 'Matrix', icon: Table },
    { id: 'gaps', name: 'Gaps', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/60 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white shadow-md">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="font-bold text-slate-900 text-[15px] tracking-tight">RoleMap</h1>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-[0.1em]">Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center px-3 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Enterprise Draft
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            Export
          </button>
          <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-56 border-r border-slate-200/60 bg-white/50 p-4 hidden md:block">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onViewChange(tab.id as ViewType)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Organization</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 rounded-md group">
                <span className="truncate">Core AI Team</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-pulse"></span>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] text-slate-400 opacity-60">
                <span className="truncate">Platform Ops</span>
              </button>
            </div>
          </div>
          
          <div className="mt-auto absolute bottom-6 left-4 right-4">
             <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100/50">
               <p className="text-[11px] font-semibold text-indigo-900 mb-1">AI Insights</p>
               <p className="text-[10px] text-indigo-700/80 leading-relaxed">System is analyzing 14 responsibility overlaps.</p>
             </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
