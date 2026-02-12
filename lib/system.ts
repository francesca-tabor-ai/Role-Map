
/**
 * RoleMap System Utilities
 * Consolidation of logging, monitoring, and environment validation.
 */

export const env = {
  apiKey: process.env.API_KEY || '',
  isProduction: window.location.hostname !== 'localhost',
};

export const validateEnv = () => {
  if (!env.apiKey) {
    console.error('Missing API_KEY environment variable.');
    return false;
  }
  return true;
};

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export const logger = {
  log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const payload = { timestamp, level, message, ...(data && { data }), url: window.location.href };
    if (level === 'error') console.error(`[RoleMap] ${message}`, payload);
    else if (level === 'warn') console.warn(`[RoleMap] ${message}`, payload);
    else console.log(`[RoleMap] ${message}`, payload);
  },
  info(msg: string, data?: any) { this.log('info', msg, data); },
  warn(msg: string, data?: any) { this.log('warn', msg, data); },
  error(msg: string, data?: any) { this.log('error', msg, data); },
  debug(msg: string, data?: any) { this.log('debug', msg, data); }
};

import { useEffect } from 'react';

export const useMonitoring = (name: string) => {
  useEffect(() => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (duration > 100) logger.debug(`Performance: ${name}`, { durationMs: duration });
    };
  }, [name]);
};

export const checkSystemHealth = async () => {
  try {
    const storageAvailable = typeof localStorage !== 'undefined';
    if (!storageAvailable) throw new Error('LocalStorage unavailable');
    return { status: 'healthy', database: 'simulated' };
  } catch (err) {
    logger.error('Health check failed', err);
    return { status: 'unhealthy', error: (err as any).message };
  }
};
