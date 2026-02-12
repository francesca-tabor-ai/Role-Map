
import React, { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate magic link flow
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      // Automatically log in for demo purposes after 1.5s
      setTimeout(() => onLogin(email), 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f9fc] p-6 selection:bg-indigo-100">
      <div className="w-full max-w-[400px] space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to RoleMap</h1>
            <p className="text-slate-500 text-[15px]">The modern accountability engine for AI teams.</p>
          </div>
        </div>

        <div className="stripe-card p-8 border border-slate-200/60 text-left">
          {sent ? (
            <div className="text-center py-4 space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="font-bold text-slate-900">Check your email</h2>
              <p className="text-sm text-slate-500">We've sent a magic link to <span className="font-semibold text-slate-800">{email}</span>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-[15px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full stripe-button py-2.5 rounded-md text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue with Magic Link'}
              </button>
            </form>
          )}
        </div>

        <p className="text-[13px] text-slate-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Auth;
