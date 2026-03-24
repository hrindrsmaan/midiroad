import pino from 'pino';

// HARDCODED FOR VERIFICATION
const SOURCE_TOKEN = "uCyA1YaFehqpeUFKybebRanK";

// For verification: we use a multi-stream approach so you see it in terminal too
const transport = pino.transport({
  targets: [
    {
      target: '@logtail/pino',
      options: { sourceToken: SOURCE_TOKEN }
    },
    {
      target: 'pino-pretty', // This will keep logs in your terminal
      options: { colorize: true }
    }
  ]
});

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
}, transport);

export default logger;
