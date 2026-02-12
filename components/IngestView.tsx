
import React, { useState } from 'react';
import { Person, RoleCategory } from '../types';
import { geminiService } from '../services/geminiService';
import { db } from '../lib/db';
import { Sparkles, Loader2, Trash2, ArrowRight, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { ConfidenceBadge, Badge } from './DesignSystem';

export const IngestView: React.FC<{ 
  people: Person[]; 
  onAddPerson: (p: Person) => void; 
  onRemovePerson: (id: string) => void 
}> = ({ people, onAddPerson, onRemovePerson }) => {
  const [inputText, setInputText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [previewList, setPreviewList] = useState<Partial<Person>[]>([]);

  const handleParse = async () => {
    if (!inputText.trim()) return;
    setIsParsing(true);
    try {
      const results = await geminiService.parseMultipleProfiles(inputText);
      setPreviewList(results);
    } catch (err) {
      console.error("Bulk parse error", err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmSingle = async (preview: Partial<Person>, index: number) => {
    const p = await db.people.create({
      organization_id: 'org-1',
      name: preview.name || 'Unknown',
      title: preview.title,
      role_classification: preview.canonicalRole,
      seniority: preview.seniority,
      source_text: inputText
    });
    onAddPerson({ ...preview, id: p.id } as Person);
    setPreviewList(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirmAll = async () => {
    for (const preview of previewList) {
      const p = await db.people.create({
        organization_id: 'org-1',
        name: preview.name || 'Unknown',
        title: preview.title,
        role_classification: preview.canonicalRole,
        seniority: preview.seniority,
        source_text: inputText
      });
      onAddPerson({ ...preview, id: p.id } as Person);
    }
    setPreviewList([]);
    setInputText('');
  };

  const removeFromPreview = (index: number) => {
    setPreviewList(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ingest Profiles</h2>
        <p className="text-sm text-slate-500">Paste one or many LinkedIn profiles to automatically map the organization.</p>
      </div>

      {previewList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text containing multiple profiles (e.g. copied from LinkedIn search results or a team roster document)..."
            className="w-full h-80 p-6 outline-none resize-none text-[14px] leading-relaxed placeholder:text-slate-300"
          />
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-[11px] text-slate-400 font-medium italic">Gemini will automatically split and classify individuals.</p>
            <button
              onClick={handleParse}
              disabled={isParsing || !inputText.trim()}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-30 transition-all hover:bg-slate-800 shadow-lg active:scale-95"
            >
              {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Analyze Roster
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-slate-900">Review Detected Talent ({previewList.length})</h3>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setPreviewList([])} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Discard All</button>
              <button 
                onClick={handleConfirmAll} 
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                Confirm & Add All
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewList.map((preview, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 hover:border-slate-300 transition-all shadow-sm flex flex-col group relative">
                <button 
                  onClick={() => removeFromPreview(idx)}
                  className="absolute top-4 right-4 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {preview.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[15px] font-bold text-slate-900 truncate">{preview.name}</h4>
                    <p className="text-[12px] text-slate-500 truncate">{preview.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Role</span>
                    <Badge variant="indigo">{preview.canonicalRole}</Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Seniority</span>
                    <Badge>{preview.seniority}</Badge>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => handleConfirmSingle(preview, idx)}
                    className="flex items-center gap-2 px-3 py-1.5 text-indigo-600 font-bold text-[11px] uppercase tracking-wider hover:bg-indigo-50 rounded-md transition-all"
                  >
                    Add Individually
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roster Section */}
      <div className="space-y-4 pt-10 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Organization Roster ({people.length})</h3>
          {people.length > 0 && (
            <p className="text-[11px] text-slate-400">Total mapping completed: {Math.min(100, Math.round(people.length * 5))}% coverage</p>
          )}
        </div>
        
        {people.length === 0 ? (
          <div className="py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <UserPlus className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-600 mb-1">Your organization is empty</h4>
            <p className="text-xs text-slate-400 max-w-[240px]">Paste profile text above to start mapping roles and accountabilities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {people.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg group hover:border-slate-300 transition-all shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {p.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[12px] font-bold text-slate-900 truncate">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{p.canonicalRole}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onRemovePerson(p.id)} 
                  className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngestView;
