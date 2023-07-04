const winston = require('winston');
const dotenv = require('dotenv');
dotenv.config();

const { createLogger, format } = winston;
const { combine, timestamp } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = createLogger({
  transports: [
    new DailyRotateFile({
      filename: 'log/MiVicsLoader_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: process.env.LOGLEVEL,
      maxFiles: 30, // Leave log files for the last 30 days
    })
  ],
  format: combine(
    timestamp(),
    format.printf(({ level, message, timestamp, stack }) => {
      let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
      
      if (stack) {
        log += `\n${stack}`;
      }
      
      return log;
    })
  )
});

module.exports = logger;