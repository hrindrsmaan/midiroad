import pino from 'pino';

const SOURCE_TOKEN = "uCyA1YaFehqpeUFKybebRanK";

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
}, {
  write: (msg) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const logObj = JSON.parse(msg);

    // 1. Send to BetterStack via Fetch (Async) - PRODUCTION ONLY
    if (isProduction && SOURCE_TOKEN) {
      // BetterStack likes 'message' field instead of just 'msg'
      const betterStackPayload = {
        ...logObj,
        message: logObj.msg,
        dt: new Date(logObj.time).toISOString(),
      };

      fetch('https://in.logs.betterstack.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SOURCE_TOKEN}`,
        },
        body: JSON.stringify(betterStackPayload),
      }).catch(() => {});
    }

    // 2. Local Terminal Visibility (Pretty logs if not production)
    if (!isProduction) {
      // We manually format to make it "Pretty" without needing worker threads
      const time = new Date(logObj.time).toLocaleTimeString();
      const level = logObj.level === 30 ? 'INFO' : logObj.level === 40 ? 'WARN' : 'ERROR';
      const color = logObj.level === 30 ? '\x1b[32m' : logObj.level === 40 ? '\x1b[33m' : '\x1b[31m';
      console.log(`${color}[${time}] ${level}:\x1b[0m ${logObj.msg}`, logObj.userIP || logObj.intentId || "");
    } else if (process.stdout) {
      process.stdout.write(msg);
    }
  }
});

export default logger;
