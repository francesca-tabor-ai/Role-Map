
import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import IngestView from './components/IngestView';
import OrgChart from './components/OrgChart';
import RACIMatrix from './components/RACIMatrix';
import GapAnalysis from './components/GapAnalysis';
import TestRunner from './components/TestRunner';
import { Person, ViewType, Activity, ResponsibilityAssignment, RACIType, RoleCategory } from './types';
import { MOCK_INITIAL_PEOPLE, ACTIVITY_TEMPLATES } from './constants';
import { db } from './lib/db';
import { validateEnv, logger, useMonitoring } from './lib/system';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader2, AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>('ingest');
  const [people, setPeople] = useState<Person[]>([]);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITY_TEMPLATES['AI Product Delivery']);
  const [assignments, setAssignments] = useState<ResponsibilityAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useMonitoring('RootApp');

  useEffect(() => {
    const initialize = async () => {
      if (!validateEnv()) {
        setError('API_KEY is missing in environment.');
        return;
      }
      const saved = localStorage.getItem('rolemap_user');
      if (saved) {
        setUser(saved);
        await loadOrg();
      } else {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  const loadOrg = async () => {
    setIsLoading(true);
    try {
      const orgId = 'org-1';
      const dbPeople = await db.people.getByOrg(orgId);
      
      let currentPeople: Person[] = [];

      if (dbPeople.length === 0) {
        currentPeople = MOCK_INITIAL_PEOPLE;
        setPeople(MOCK_INITIAL_PEOPLE);
      } else {
        // Fix: Explicitly type the map callback and resolve RoleCategory carefully to avoid string/enum mismatch
        currentPeople = dbPeople.map((p): Person => {
          const firstWord = (p.role_classification || '').split(' ')[0].toUpperCase();
          const category = (RoleCategory as any)[firstWord] || RoleCategory.ENGINEERING;
          
          return {
            id: p.id,
            name: p.name,
            title: p.title || '',
            canonicalRole: p.role_classification || '',
            category: category as RoleCategory,
            seniority: (p.seniority as any) || 'Mid',
            skills: [],
            managerId: p.manager_id
          };
        });
        setPeople(currentPeople);
      }

      const allAssignments: ResponsibilityAssignment[] = [];
      for (const p of currentPeople) {
        const pAssignments = await db.assignments.getByPerson(p.id);
        pAssignments.forEach(a => {
          allAssignments.push({
            personId: a.person_id,
            activityId: a.activity_id,
            raciType: a.raci_type
          });
        });
      }
      setAssignments(allAssignments);
      logger.info('Org state loaded successfully');
    } catch (err) {
      logger.error('Failed to load org data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAssignment = async (pid: string, aid: string, type: RACIType) => {
    try {
      if (type === RACIType.NONE) await db.assignments.delete(pid, aid);
      else await db.assignments.upsert(pid, aid, type);
      
      setAssignments(prev => {
        const filtered = prev.filter(a => !(a.personId === pid && a.activityId === aid));
        return type === RACIType.NONE ? filtered : [...filtered, { personId: pid, activityId: aid, raciType: type }];
      });
    } catch (err) {
      logger.error('Assignment update failed', err);
    }
  };

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="bg-white p-10 border border-red-100 rounded-2xl text-center space-y-4 shadow-xl max-w-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="text-xl font-bold text-slate-900">Configuration Required</h1>
        <p className="text-sm text-slate-500 leading-relaxed">{error}</p>
        <div className="pt-4">
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">Retry</button>
        </div>
      </div>
    </div>
  );

  if (!user) return <Auth onLogin={(e) => { localStorage.setItem('rolemap_user', e); setUser(e); }} />;

  return (
    <Dashboard currentView={view} onViewChange={setView} userEmail={user} onLogout={() => { localStorage.removeItem('rolemap_user'); setUser(null); }}>
      {isLoading ? (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Organization...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {view === 'ingest' && (
            <IngestView 
              people={people} 
              onAddPerson={p => setPeople(prev => [...prev, p])} 
              onRemovePerson={id => { db.people.delete(id); setPeople(prev => prev.filter(x => x.id !== id)); }} 
            />
          )}
          {view === 'org-chart' && <OrgChart people={people} />}
          {view === 'raci' && (
            <RACIMatrix 
              people={people} 
              activities={activities} 
              assignments={assignments} 
              onUpdateAssignment={handleUpdateAssignment} 
              onSetAssignments={setAssignments} 
              onAddActivities={setActivities} 
            />
          )}
          {view === 'gaps' && <GapAnalysis people={people} assignments={assignments} activities={activities} />}
          {view === 'tests' && <TestRunner />}
        </div>
      )}
    </Dashboard>
  );
};

const App: React.FC = () => <ErrorBoundary><AppContent /></ErrorBoundary>;
export default App;
