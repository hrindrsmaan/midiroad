import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

// EMERGENCY FIX: Standard pino without worker thread transports to prevent 500s on Vercel
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    env: process.env.NODE_ENV,
    ver: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
  },
});

export default logger;
