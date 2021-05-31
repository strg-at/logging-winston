import winston = require('winston')
import { Format, TransformableInfo } from 'logform'


const NODE_LOG_FORMAT: string = process.env.NODE_LOG_FORMAT && process.env.NODE_LOG_FORMAT.toLowerCase() === 'simple' ? 'simple' : 'json'
const NODE_LOG_LEVEL: string = process.env.NODE_LOG_LEVEL ? process.env.NODE_LOG_LEVEL : 'info'
const NODE_LOG_STACK_KEY: string = process.env.NODE_LOG_STACK_KEY ? process.env.NODE_LOG_STACK_KEY.toString() : 'stack_trace'

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

const addIndent = (str: string, indentLevel: number): string => {
  return str.split("\n").map(item => `${'  '.repeat(indentLevel)}${item}`).join("\n")
}

const mergeStacks = (err: any) => {
  if (!(err.message instanceof Error)) {
    return ''
  }
  let error = err.message
  let stack = `${error.stack}`
  let indent = 1
  while (error && error.error && error.error instanceof Error && error.error.stack) {
    stack = `${stack}\n`
    error = error.error
    stack = `${stack}${addIndent(error.stack, indent++)}\n`
  }
  return stack
}

const getStackObject = (info: any) => {
  const result: {  [key: string]: any; } = {}
  result[NODE_LOG_STACK_KEY] = mergeStacks(info)
  return result
}

const displayStackJson = winston.format((info: any) => {
  if (info.level === 'error' && info.message && info.message instanceof Error) {
    return Object.assign({}, info, getStackObject(info), {
      message: info.message.message
    })
  } else if (info.level === 'error' && info instanceof Error) {
    return Object.assign({}, info, getStackObject(info), {
      message: info.message
    })
  }
  return info
})

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

