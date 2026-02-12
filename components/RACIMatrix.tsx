
import React, { useState } from 'react';
import { Person, Activity, ResponsibilityAssignment, RACIType } from '../types';
import { ACTIVITY_TEMPLATES } from '../constants';
import { geminiService } from '../services/geminiService';
import { Sparkles, Loader2, ChevronDown, MousePointer2, Info, Maximize2, Minimize2, MoveHorizontal, AlertCircle } from 'lucide-react';
import { RaciCell } from './DesignSystem';

interface RACIMatrixProps {
  people: Person[];
  activities: Activity[];
  assignments: ResponsibilityAssignment[];
  onUpdateAssignment: (personId: string, activityId: string, type: RACIType) => void;
  onSetAssignments: (assignments: ResponsibilityAssignment[]) => void;
  onAddActivities: (activities: Activity[]) => void;
}

const RACIMatrix: React.FC<RACIMatrixProps> = ({ 
  people, 
  activities, 
  assignments, 
  onUpdateAssignment,
  onSetAssignments,
  onAddActivities
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('AI Product Delivery');
  const [focusedCell, setFocusedCell] = useState<{ personId: string, activityId: string } | null>(null);
  const [colWidth, setColWidth] = useState(200);
  const [activityColWidth, setActivityColWidth] = useState(380);
  
  const handleGenerateRACI = async () => {
    if (people.length === 0 || activities.length === 0) return;
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const suggested = await geminiService.suggestRACI(people, activities);
      if (suggested && suggested.length > 0) {
        onSetAssignments(suggested);
      } else {
        setErrorMessage("AI returned empty assignments. Try again.");
      }
    } catch (err: any) {
      console.error("RACI Generation Error:", err);
      if (err?.message?.includes('429') || err?.status === 429) {
        setErrorMessage("API Quota exceeded. Please wait a minute before retrying.");
      } else {
        setErrorMessage("Failed to generate assignments. Check console for details.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyTemplate = (templateName: string) => {
    setSelectedTemplate(templateName);
    onAddActivities(ACTIVITY_TEMPLATES[templateName]);
  };

  const getRaciValue = (personId: string, activityId: string) => {
    return assignments.find(a => a.personId === personId && a.activityId === activityId)?.raciType || RACIType.NONE;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Responsibility Matrix</h2>
          <p className="text-slate-500 max-w-xl text-sm font-medium leading-relaxed">
            Clarify roles and accountability across the lifecycle. Adjust column widths to see full names and titles.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MoveHorizontal className="w-3 h-3" /> Width
            </span>
            <input 
              type="range" 
              min="140" 
              max="400" 
              value={colWidth} 
              onChange={(e) => setColWidth(parseInt(e.target.value))}
              className="w-24 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="relative">
            <select
              value={selectedTemplate}
              onChange={(e) => handleApplyTemplate(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 pl-4 pr-10 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none cursor-pointer transition-all"
            >
              {Object.keys(ACTIVITY_TEMPLATES).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex flex-col gap-1 items-end">
            <button
              onClick={handleGenerateRACI}
              disabled={isGenerating || people.length === 0}
              className="stripe-button flex items-center gap-2 text-white px-6 py-2 rounded-lg font-bold text-xs shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] min-w-[150px] justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Mapping...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Assign</span>
                </>
              )}
            </button>
            {errorMessage && (
              <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" />
                {errorMessage}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden shadow-xl rounded-2xl relative group">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th 
                  style={{ width: activityColWidth }}
                  className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] sticky left-0 bg-slate-50 z-40 border-r border-slate-200 shadow-[4px_0_8px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex items-center justify-between">
                    <span>Activity / Deliverable</span>
                    <button 
                      onClick={() => setActivityColWidth(prev => prev === 380 ? 550 : 380)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-400 transition-colors"
                    >
                      {activityColWidth === 380 ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                    </button>
                  </div>
                </th>
                {people.map((person) => (
                  <th 
                    key={person.id} 
                    style={{ width: colWidth }}
                    className="p-5 text-center border-r border-slate-100 last:border-r-0 sticky top-0 bg-slate-50/80 z-30"
                  >
                    <div className="text-[13px] font-bold text-slate-900 leading-tight mb-1 whitespace-normal break-words">
                      {person.name}
                    </div>
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest whitespace-normal leading-tight">
                      {person.canonicalRole}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={people.length + 1} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                          <MousePointer2 className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Select a lifecycle template to populate the matrix.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr key={activity.id} className="group transition-colors hover:bg-slate-50/30">
                    <td className="p-6 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-30 border-r border-slate-200 shadow-[4px_0_8px_rgba(0,0,0,0.02)]">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[9px] font-black text-indigo-500 mb-1 uppercase tracking-widest leading-none">
                            {activity.category}
                          </div>
                          <div className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-indigo-900 transition-colors whitespace-normal">
                            {activity.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    {people.map((person) => (
                      <td 
                        key={`${activity.id}-${person.id}`} 
                        className={`p-0 border-r border-slate-50 last:border-r-0 text-center transition-all ${focusedCell?.personId === person.id ? 'bg-indigo-500/5' : ''}`}
                        onMouseEnter={() => setFocusedCell({ personId: person.id, activityId: activity.id })}
                        onMouseLeave={() => setFocusedCell(null)}
                      >
                        <RaciCell 
                          value={getRaciValue(person.id, activity.id)}
                          onChange={(val) => onUpdateAssignment(person.id, activity.id, val)}
                          isFocused={focusedCell?.personId === person.id && focusedCell?.activityId === activity.id}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { key: 'R', label: 'Responsible', color: 'bg-indigo-50 text-indigo-600', desc: 'The "Doer". Performs the work to complete the task.' },
          { key: 'A', label: 'Accountable', color: 'bg-slate-900 text-white', desc: 'The "Owner". Ultimate authority; exactly one per activity.' },
          { key: 'C', label: 'Consulted', color: 'bg-slate-50 text-slate-600 border-slate-200', desc: 'The "Expert". Two-way communication before/during work.' },
          { key: 'I', label: 'Informed', color: 'bg-slate-50 text-slate-400 border-slate-100', desc: 'The "Subscriber". Kept up to date on progress/completion.' }
        ].map(item => (
          <div key={item.key} className="bg-white p-5 border border-slate-200 rounded-xl hover:border-indigo-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className={`flex items-center justify-center w-6 h-6 rounded font-black text-[11px] shadow-sm border ${item.color}`}>
                {item.key}
              </span>
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                {item.label}
              </span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 p-4 bg-indigo-50/40 border border-indigo-100/50 rounded-xl shadow-inner">
        <Info className="w-4 h-4 text-indigo-500 shrink-0" />
        <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
          <strong>UI Tip:</strong> Use the width slider above to expand the matrix if names are cut off. <strong>Auto-Assign</strong> uses Gemini 3 Pro to intelligently map your roster to the selected delivery lifecycle based on seniority and specialized AI roles.
        </p>
      </div>
    </div>
  );
};

export default RACIMatrix;
