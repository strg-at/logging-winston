import { logger } from './index'

const LOG = logger.child({ requestId: '451' });
/*
try {
  throw new Error('test')
} catch (err) {
  logger.error(err)
}

try {
  throw new Error('test')
} catch (err) {
  logger.error(err, { time: Date.now() })
}
*/

import { CustomError } from 'ts-custom-error'

export class AuthenticationError extends CustomError {
  constructor(message?: string, private error?: Error) {
    super(message)
  }
}
/*
try {
  throw new AuthenticationError('test')
} catch (err) {
  logger.error(err, { time: Date.now() })
}

try {
  throw new AuthenticationError('test')
} catch (err) {
  logger.error(err)
}
*/

try {
  try {
    throw new AuthenticationError('test')
  } catch (err) {
    throw new Error(<any>err)
  }
} catch (err) {
    LOG.error(<any>err, { time: Date.now() })
}
/*
try {
  try {
    throw new AuthenticationError('test')
  } catch (err) {
    throw new AuthenticationError('oops', err)
  }
} catch (err) {
  logger.error(err, {a: 1})
}
*/

