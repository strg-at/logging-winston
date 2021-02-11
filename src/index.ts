import winston = require('winston')
import { Format, TransformableInfo } from 'logform'


const NODE_LOG_FORMAT: string = process.env.NODE_LOG_FORMAT && process.env.NODE_LOG_FORMAT.toLowerCase() === 'simple' ? 'simple' : 'json'
const NODE_LOG_LEVEL: string = process.env.NODE_LOG_LEVEL ? process.env.NODE_LOG_LEVEL : 'info'

winston.addColors({
  fatal: 'magenta',
  error: 'red',
  warn: 'yellow',
  info: 'green',
  trace: 'blue',
  debug: 'grey',
})

const displayStackSimple = winston.format((info: TransformableInfo) => {
  info.message = info.stack ? info.stack : info.message
  return info
})

const displayStackJson = winston.format((info: any) => {
  if (info.level === 'error' && info.message?.error instanceof Error) {
    return Object.assign({}, info, {
      stack: info.message.error.stack,
      message: info.message.error.message
    })
  }
  return info
});

const jsonFormat: Format = winston.format.combine(
  winston.format.metadata(),
  displayStackJson(),
  winston.format.json()
)

const simpleFormat: Format = winston.format.combine(
  displayStackSimple(),
  winston.format.colorize({ all: true }),
  winston.format.simple(),
)

const logger = winston.createLogger({
  transports: [new winston.transports.Console({
    stderrLevels: ['fatal', 'error'],
    level: NODE_LOG_LEVEL,
  })],
  format: NODE_LOG_FORMAT === 'simple' ? simpleFormat : jsonFormat,
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5,
  },
})

// always log uncaught to error log
process.on('uncaughtException', (e) => logger.error(e))


// always log unhandled promise rejection to error log
process.on('unhandledRejection', (reason: {} | null | undefined, promise: Promise<any>) => {
  if (reason instanceof Error) {
    logger.error(reason)
  } else {
    logger.error(new Error(`${reason}`))
  }
})

export { logger }
