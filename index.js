// @flow

import type { Context, Middleware } from 'koa';
import type { ErrorType } from './types/error-type';
import type { WarningType } from './types/warning-type';

const INTERNAL_SEVER_ERROR_CODE: number = 500;
const ERROR_MESSAGE: string = 'An error occurred';

const handleError = (
  app: any,
  onError: (error: Error, errorType: string) => void,
  onWarning: (warning: Error, warningType: WarningType) => void
): Middleware => {
  if (typeof onError !== 'function') {
    throw new TypeError('onError must be a function');
  }

  if (typeof onWarning !== 'function') {
    throw new TypeError('onWarning must be a function');
  }

  const processError = (err: Error, errorType: ErrorType, ctx?: Context) => {
    if (ctx) {
      ctx.status = INTERNAL_SEVER_ERROR_CODE;
      ctx.body = ERROR_MESSAGE;
    }

    onError(err, errorType);
  };

  const processWarning = (warning: Error, warningType: WarningType) => {
    onWarning(warning, warningType);
  };

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.app.emit('error', err, ctx);
    }
  });

  app.on('error', (err, ctx) => {
    processError(err, 'app:error', ctx);
  });

  process.on('unhandledRejection', (err, promise) => {
    processError(err, 'process:unhandledRejection');
  });

  process.on('rejectionHandled', promise => {
    processError(
      new Error('rejectionHandled: ' + arguments[2].toString()),
      'process:rejectionHandled'
    );
  });

  process.on('uncaughtException', err => {
    processError(err, 'process:uncaughtException');
    process.exit(1);
  });

  process.on('warning', warning => {
    processWarning(warning, 'process:warning');
  });

  return async (ctx: Context, next) => {
    await next();
  };
};

module.exports = handleError;
module.exports.default = handleError;
module.exports.INTERNAL_SEVER_ERROR_CODE = INTERNAL_SEVER_ERROR_CODE;
module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
