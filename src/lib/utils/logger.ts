export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel: LogLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

function shouldLog(level: LogLevel) {
  return levelPriority[level] >= levelPriority[configuredLevel];
}

/**
 * Logs structured messages with consistent format. Safe for server and client.
 */
export const logger = {
  debug: (msg: string, meta?: unknown) => {
    if (shouldLog('debug')) console.debug(`[DEBUG] ${msg}`, meta ?? '');
  },
  info: (msg: string, meta?: unknown) => {
    if (shouldLog('info')) console.info(`[INFO] ${msg}`, meta ?? '');
  },
  warn: (msg: string, meta?: unknown) => {
    if (shouldLog('warn')) console.warn(`[WARN] ${msg}`, meta ?? '');
  },
  error: (msg: string, meta?: unknown) => {
    if (shouldLog('error')) console.error(`[ERROR] ${msg}`, meta ?? '');
  },
};


