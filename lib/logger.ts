import pino from 'pino';

const SOURCE_TOKEN = "uCyA1YaFehqpeUFKybebRanK";

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    env: process.env.NODE_ENV,
    ver: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
  },
}, {
  write: (msg) => {
    // 1. Send to BetterStack via Fetch (Async/Fire-and-forget)
    if (SOURCE_TOKEN) {
      fetch('https://in.logs.betterstack.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SOURCE_TOKEN}`,
        },
        body: msg,
      }).catch(() => {
        // Silent fail to prevent crashing the app if logging fails
      });
    }

    // 2. Always log to stdout for Vercel/Terminal visibility (Server-only)
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(msg);
    }
  }
});

export default logger;
