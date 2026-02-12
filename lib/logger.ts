
/**
 * RoleMap Logger
 * Simple structured logging that can be piped to external services like Axiom or Sentry.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      message,
      ...(data && { data }),
      url: window.location.href,
    };

    if (level === 'error') {
      console.error(`[RoleMap] ${message}`, payload);
    } else if (level === 'warn') {
      console.warn(`[RoleMap] ${message}`, payload);
    } else {
      console.log(`[RoleMap] ${message}`, payload);
    }

    // In a real Vercel app, you might send this to an ingest endpoint:
    // fetch('/api/log', { method: 'POST', body: JSON.stringify(payload) }).catch(() => {});
  }

  info(msg: string, data?: any) { this.log('info', msg, data); }
  warn(msg: string, data?: any) { this.log('warn', msg, data); }
  error(msg: string, data?: any) { this.log('error', msg, data); }
  debug(msg: string, data?: any) { this.log('debug', msg, data); }
}

export const logger = new Logger();
