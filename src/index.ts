import winston = require('winston')
import { Format } from 'logform'

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

const displayStackSimple = winston.format((info: any) => {
  if (info.level !== 'error') {
    return info
  }

  let message = ''
  let level = 1
  if (info instanceof Error) {
    const stacks = mergeStacks(info)
    message = addIndent(stacks.stack, level)
    if (stacks.cause) {
      level++
      let currentCause = stacks.cause
      while (currentCause) {
        if (typeof currentCause === 'string') {
          message = message + `${currentCause}`
          break;
        }
        message += `\n${addIndent(currentCause.stack, level)}`
        if (!currentCause.cause) {
          break
        }
        currentCause = currentCause.cause
      }
    }
  }

  return{
    ...info,
    message
  }
})

const addIndent = (str: string, indentLevel: number): string => {
  return str.split("\n").map(item => `${'  '.repeat(indentLevel)}${item}`).join("\n")
}

type Stacks = {
  message: string
  stack: string
  cause?: Stacks | string
}

const mergeStacks = (err: Error): Stacks => {
  const stack = err.stack || ''

  if (!(err.cause instanceof Error) && typeof err.cause !== 'string') {
    return {
      message: err.message,
      stack: stack,
    }
  }

  const cause = (err.cause && err.cause instanceof Error) ? mergeStacks(err.cause) : err.cause ?? ''

  return {
    message: err.message,
    stack: stack,
    cause: cause
  }
}

const getStackObject = (info: any) => {
  const result: {  [key: string]: any; } = {}
  result[NODE_LOG_STACK_KEY] = mergeStacks(info)
  return result
}

const displayStackJson = winston.format((info: any) => {
  if (info.level !== 'error') {
    return info
  }

  if (info instanceof Error) {
    return {
      ...info,
      ...getStackObject(info)
    }
  }

  if (info.message && info.message instanceof Error) {
    return {
      ...info,
      ...getStackObject(info.message)
    }
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

