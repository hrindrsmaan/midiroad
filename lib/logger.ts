import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

// Configuration for BetterStack (Logtail) in production
const transport = isProduction && process.env.LOGTAIL_SOURCE_TOKEN
  ? {
      target: '@logtail/pino',
      options: { sourceToken: process.env.LOGTAIL_SOURCE_TOKEN }
    }
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'SYS:standard',
      },
    };

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport,
  base: {
    env: process.env.NODE_ENV,
    ver: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
  },
});

export default logger;
