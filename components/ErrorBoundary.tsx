
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { logger } from '../lib/system';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Global error boundary to catch and log runtime exceptions.
 */
export class ErrorBoundary extends Component<Props, State> {
  // Fix: Explicitly initializing state and calling super(props) to ensure 'this.props' is available and typed
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught runtime error', { error, errorInfo });
  }

  public render(): ReactNode {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-slate-900">Application Error</h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                RoleMap encountered an unexpected problem. We've logged the error and are looking into it.
              </p>
              {error && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-[10px] font-mono text-slate-400 text-left overflow-auto max-h-32">
                  {error.message}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Application
              </button>
              <button 
                onClick={() => (window.location.href = '/')}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all"
              >
                <Home className="w-4 h-4" />
                Back to Safety
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
