
import { useEffect } from 'react';
import { logger } from './logger';

/**
 * Hook to monitor component performance and system health.
 */
export const useMonitoring = (componentName: string) => {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      if (duration > 100) { // Log long tasks
        logger.debug(`Performance: ${componentName} session duration`, { durationMs: duration });
      }
    };
  }, [componentName]);
};

/**
 * Checks if the mock database is responsive.
 */
export const checkSystemHealth = async () => {
  try {
    const storageAvailable = typeof localStorage !== 'undefined';
    if (!storageAvailable) throw new Error('LocalStorage unavailable');
    return { status: 'healthy', database: 'simulated' };
  } catch (err) {
    logger.error('Health check failed', err);
    return { status: 'unhealthy', error: (err as Error).message };
  }
};
