
import React, { useState, useEffect } from 'react';
import { profileParser } from '../lib/parser';
import { GapDetector } from '../lib/ai/gapDetector';
import { Person, RoleCategory, Activity, ResponsibilityAssignment, RACIType } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  Terminal, 
  RefreshCw, 
  Search,
  CheckCircle,
  Clock,
  Beaker
} from 'lucide-react';

interface TestResult {
  name: string;
  suite: string;
  status: 'pass' | 'fail' | 'pending';
  error?: string;
  duration?: number;
}

const TestRunner: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    const newResults: TestResult[] = [];
    const startAll = performance.now();

    const runTest = (suite: string, name: string, fn: () => void) => {
      const start = performance.now();
      try {
        fn();
        newResults.push({ name, suite, status: 'pass', duration: performance.now() - start });
      } catch (e) {
        newResults.push({ 
          name, 
          suite, 
          status: 'fail', 
          error: e instanceof Error ? e.message : String(e),
          duration: performance.now() - start 
        });
      }
    };

    // --- Parser Tests ---
    runTest('Parser', 'should extract name from first line', () => {
      const text = "John Doe\nMachine Learning Engineer";
      const parsed = profileParser.parse(text);
      if (parsed.name !== "John Doe") throw new Error(`Expected John Doe, got ${parsed.name}`);
    });

    runTest('Parser', 'should identify Senior seniority', () => {
      const text = "Jane Smith\nSenior Applied AI Engineer";
      const parsed = profileParser.parse(text);
      if (parsed.seniority !== "Senior") throw new Error(`Expected Senior, got ${parsed.seniority}`);
    });

    runTest('Parser', 'should classify Machine Learning Engineer role', () => {
      const text = "Alex Rivera\nMLE at TechCorp";
      const parsed = profileParser.parse(text);
      if (parsed.canonicalRole !== "Machine Learning Engineer") throw new Error(`Expected MLE, got ${parsed.canonicalRole}`);
    });

    // --- Gap Detector Tests ---
    runTest('GapDetector', 'should flag missing Accountable owner', () => {
      const activities: Activity[] = [{ id: '1', name: 'Review Models', category: 'Ops' }];
      const people: Person[] = [{ id: 'p1', name: 'Bob', title: 'Eng', canonicalRole: 'MLE', category: RoleCategory.ENGINEERING, seniority: 'Mid', skills: [] }];
      const assignments: ResponsibilityAssignment[] = [
        { personId: 'p1', activityId: '1', raciType: RACIType.R } // Responsible but no Accountable
      ];
      const gaps = GapDetector.detectGaps(people, assignments, activities);
      const hasMissingA = gaps.some(g => g.type === 'missing_raci' && g.message.includes('No one is Accountable'));
      if (!hasMissingA) throw new Error("Expected missing accountability gap");
    });

    runTest('GapDetector', 'should flag overloaded person', () => {
      const activities: Activity[] = [
        { id: '1', name: 'A1', category: 'C1' },
        { id: '2', name: 'A2', category: 'C1' },
        { id: '3', name: 'A3', category: 'C1' },
        { id: '4', name: 'A4', category: 'C1' },
        { id: '5', name: 'A5', category: 'C1' },
      ];
      const people: Person[] = [{ id: 'p1', name: 'Overworked Bob', title: 'Eng', canonicalRole: 'MLE', category: RoleCategory.ENGINEERING, seniority: 'Mid', skills: [] }];
      const assignments: ResponsibilityAssignment[] = activities.map(a => ({
        personId: 'p1', activityId: a.id, raciType: RACIType.A
      }));
      const gaps = GapDetector.detectGaps(people, assignments, activities);
      const isOverloaded = gaps.some(g => g.type === 'risk_concentration' && g.message.includes('overloaded'));
      if (!isOverloaded) throw new Error("Expected overload gap for 5+ Accountabilities");
    });

    runTest('GapDetector', 'should flag missing specialized safety role', () => {
      const activities: Activity[] = [{ id: '1', name: 'Safety Audit', category: 'Safety & Governance' }];
      const people: Person[] = [{ id: 'p1', name: 'Generalist', title: 'Eng', canonicalRole: 'Backend Engineer', category: RoleCategory.ENGINEERING, seniority: 'Mid', skills: [] }];
      const assignments: ResponsibilityAssignment[] = [{ personId: 'p1', activityId: '1', raciType: RACIType.A }];
      const gaps = GapDetector.detectGaps(people, assignments, activities);
      const missingSafety = gaps.some(g => g.type === 'missing_role' && g.message.includes('Safety Leadership'));
      if (!missingSafety) throw new Error("Expected missing safety role gap");
    });

    // Simulate run time
    await new Promise(r => setTimeout(r, 600));
    setResults(newResults);
    setIsRunning(false);
    setLastRun(new Date());
  };

  useEffect(() => {
    runTests();
  }, []);

  const total = results.length;
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Beaker className="w-6 h-6 text-indigo-600" />
            Integrated Test Suite
          </h2>
          <p className="text-slate-500 text-sm font-medium">Verify system integrity with automated unit tests.</p>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          Run All Tests
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pass Rate</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900">{total > 0 ? Math.round((passed / total) * 100) : 0}%</span>
            <span className="text-sm font-bold text-slate-400 pb-1">{passed} / {total}</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            {failed > 0 ? (
              <XCircle className="w-5 h-5 text-rose-500" />
            ) : passed > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <Clock className="w-5 h-5 text-slate-300" />
            )}
            <span className={`text-sm font-bold ${failed > 0 ? 'text-rose-600' : passed > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
              {failed > 0 ? 'Failing' : passed > 0 ? 'All Systems Go' : 'Idle'}
            </span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Run</p>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-300" />
            <span className="text-sm font-bold text-slate-600">{lastRun ? lastRun.toLocaleTimeString() : 'Never'}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="px-4 py-2 bg-slate-800 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">RoleMap Test Runner</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          </div>
        </div>
        <div className="p-6 font-mono text-[13px] leading-relaxed max-h-[500px] overflow-y-auto">
          {isRunning ? (
            <div className="space-y-2">
              <p className="text-indigo-400 animate-pulse">Running test suites...</p>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full animate-[progress_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="text-slate-500">No tests executed yet.</p>
          ) : (
            <div className="space-y-6">
              {['Parser', 'GapDetector'].map(suite => {
                const suiteResults = results.filter(r => r.suite === suite);
                return (
                  <div key={suite} className="space-y-2">
                    <p className="text-slate-300 font-black tracking-widest uppercase text-[10px] border-b border-slate-800 pb-1 mb-3">
                      Suite: {suite}
                    </p>
                    {suiteResults.map((r, i) => (
                      <div key={i} className="flex items-start gap-4 group">
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${r.status === 'pass' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {r.status}
                        </span>
                        <div className="flex-1">
                          <p className="text-slate-200">{r.name}</p>
                          {r.error && (
                            <p className="text-rose-400 mt-1 text-[11px] bg-rose-500/5 p-2 rounded border border-rose-500/20">{r.error}</p>
                          )}
                        </div>
                        <span className="text-slate-600 text-[10px]">{r.duration?.toFixed(1)}ms</span>
                      </div>
                    ))}
                  </div>
                );
              })}
              
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="space-x-4">
                  <span className="text-emerald-400">PASSED: {passed}</span>
                  <span className="text-rose-400">FAILED: {failed}</span>
                  <span className="text-slate-500">TOTAL: {total}</span>
                </div>
                <div className="text-slate-500">
                  Time: {results.reduce((acc, r) => acc + (r.duration || 0), 0).toFixed(2)}ms
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
        <div className="flex items-center gap-2">
           <Search className="w-4 h-4 text-indigo-600" />
           <h3 className="text-sm font-bold text-slate-900">Integration Details</h3>
        </div>
        <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
          These tests are executed in a sandboxed browser environment using the same production logic that powers your organization mapping. 
          Use the <code className="bg-slate-100 px-1 rounded text-indigo-600">Health Analysis</code> tab for live qualitative org scanning.
        </p>
      </div>
    </div>
  );
};

export default TestRunner;
