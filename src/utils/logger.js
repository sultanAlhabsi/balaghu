// simple logger - nothing fancy

function log(level, msg, data = null) {
  const time = new Date().toISOString();
  let output = `[${time}] [${level.toUpperCase()}] ${msg}`;
  if (data) {
    output += ` | ${JSON.stringify(data)}`;
  }
  
  if (level === 'error') {
    console.error(output);
  } else {
    console.log(output);
  }
}

const logger = {
  info: (msg, data) => log('info', msg, data),
  error: (msg, data) => log('error', msg, data),
  warn: (msg, data) => log('warn', msg, data),
  debug: (msg, data) => log('debug', msg, data),
};

export default logger;
