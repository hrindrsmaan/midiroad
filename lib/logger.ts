import pino from 'pino';

// HARDCODED FOR VERIFICATION
const SOURCE_TOKEN = "uCyA1YaFehqpeUFKybebRanK";

const transport = pino.transport({
  target: '@logtail/pino',
  options: { sourceToken: SOURCE_TOKEN }
});

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    env: process.env.NODE_ENV,
    ver: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
  },
}, transport);

export default logger;
