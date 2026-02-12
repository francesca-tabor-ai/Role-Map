
import React, { useState, useEffect } from 'react';
import { Person, ResponsibilityAssignment, Activity, OrgGap } from '../types';
import { geminiService } from '../services/geminiService';
import { ShieldAlert, Info, CheckCircle, RefreshCw, Loader2, Target, AlertCircle } from 'lucide-react';

interface GapAnalysisProps {
  people: Person[];
  assignments: ResponsibilityAssignment[];
  activities: Activity[];
}

const GapAnalysis: React.FC<GapAnalysisProps> = ({ people, assignments, activities }) => {
  const [gaps, setGaps] = useState<OrgGap[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const performAnalysis = async () => {
    if (people.length === 0) return;
    setIsAnalyzing(true);
    try {
      const results = await geminiService.detectGaps(people, assignments, activities);
      setGaps(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    performAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const severityStyles = {
    high: {
      card: 'border-red-200 bg-white ring-1 ring-red-50',
      icon: 'text-red-500 bg-red-50',
      badge: 'bg-red-50 text-red-600 border-red-200',
      title: 'text-red-900'
    },
    medium: {
      card: 'border-amber-200 bg-white ring-1 ring-amber-50',
      icon: 'text-amber-500 bg-amber-50',
      badge: 'bg-amber-50 text-amber-600 border-amber-200',
      title: 'text-amber-900'
    },
    low: {
      card: 'border-blue-200 bg-white ring-1 ring-blue-50',
      icon: 'text-blue-500 bg-blue-50',
      badge: 'bg-blue-50 text-blue-600 border-blue-200',
      title: 'text-blue-900'
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Health Analysis</h2>
          <p className="text-slate-500">Intelligent scanning for talent gaps, operational risks, and role congestion.</p>
        </div>
        <button
          onClick={performAnalysis}
          disabled={isAnalyzing || people.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-md font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm group disabled:opacity-50"
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />}
          Run Deep Scan
        </button>
      </div>

      {isAnalyzing ? (
        <div className="py-24 text-center space-y-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Analyzing Architecture</h3>
            <p className="text-slate-400 text-sm">Cross-referencing 25+ AI canonical roles with current assignments...</p>
          </div>
        </div>
      ) : gaps.length === 0 && people.length > 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 p-10 rounded-2xl text-center shadow-sm">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-emerald-900 mb-2">Structure Verified</h3>
          <p className="text-emerald-700/80 font-medium">No critical gaps detected. Every activity has clear ownership and specialized talent assigned.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {gaps.map((gap) => {
            const styles = severityStyles[gap.severity] || severityStyles.low;
            return (
              <div key={gap.id} className={`p-6 border rounded-xl flex items-start gap-5 transition-all hover:shadow-lg hover:-translate-y-0.5 ${styles.card}`}>
                <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${styles.icon}`}>
                  {gap.severity === 'high' ? <ShieldAlert className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded border leading-none ${styles.badge}`}>
                      {gap.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority: {gap.severity}</span>
                  </div>
                  <h4 className={`font-bold text-lg leading-snug ${styles.title}`}>{gap.message}</h4>
                  {gap.context && <p className="text-sm text-slate-600 font-medium leading-relaxed">{gap.context}</p>}
                </div>
                <button className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest hover:underline mt-1">Resolve</button>
              </div>
            );
          })}
        </div>
      )}

      <div className="stripe-card bg-slate-900 p-8 rounded-2xl text-white overflow-hidden relative shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <Target className="w-5 h-5 text-indigo-400" />
               <h3 className="text-xl font-bold">Scanning Logic</h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-[15px]">
              RoleMap uses a specialized transformer model trained on high-performance engineering orgs to identify structural inefficiencies before they impact delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
             <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                <p className="text-sm font-medium text-slate-300"><strong>Ownership:</strong> Activity lacks an Accountable (A) lead.</p>
             </div>
             <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5"></div>
                <p className="text-sm font-medium text-slate-300"><strong>Specialization:</strong> Canonical AI roles (e.g. MLOps) are missing.</p>
             </div>
             <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5"></div>
                <p className="text-sm font-medium text-slate-300"><strong>Fatigue:</strong> Single individuals holding 5+ Accountabilities.</p>
             </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default GapAnalysis;
