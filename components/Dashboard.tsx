
import React from 'react';
import Sidebar from './Sidebar';
import { ViewType } from '../types';
import { Search, Bell, Zap } from 'lucide-react';

interface DashboardProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  userEmail: string;
  onLogout: () => void;
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ currentView, onViewChange, userEmail, onLogout, children }) => {
  return (
    <div className="h-screen flex overflow-hidden bg-[#fafafa]">
      <Sidebar currentView={currentView} onViewChange={onViewChange} userEmail={userEmail} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-slate-200/60 bg-white px-8 flex items-center justify-between">
          <div className="flex-1 max-w-lg">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search organization..." 
                className="w-full pl-9 pr-4 py-1.5 text-[13px] bg-slate-50 border border-transparent focus:bg-white focus:border-slate-200 rounded-md outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-slate-400 hover:text-slate-600 transition-colors"><Bell className="w-4 h-4" /></button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-md text-[11px] font-bold hover:bg-slate-800 transition-all">
              <Zap className="w-3 h-3 fill-current" />
              Upgrade
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
