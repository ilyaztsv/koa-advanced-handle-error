// @flow

import type { Context, Middleware } from 'koa';
import type { ErrorType } from './types/error-type';
import type { WarningType } from './types/warning-type';

const INTERNAL_SEVER_ERROR_CODE: number = 500;
const INTERNAL_SEVER_ERROR_MESSAGE: string = 'Internal Server Error';
const NOT_FOUND_CODE: number = 404;
const NOT_FOUND_MESSAGE: string = 'Not Found';

const handleError = (
  app: any,
  onError: (error: Error, errorType: string, ctx?: Context) => void,
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
      if (ctx.body === undefined && ctx.request.method !== 'OPTIONS') {
        ctx.status = NOT_FOUND_CODE;
        ctx.body = NOT_FOUND_MESSAGE;
      } else {
        ctx.status = INTERNAL_SEVER_ERROR_CODE;
        ctx.body = INTERNAL_SEVER_ERROR_MESSAGE;
      }
    }

    onError(err, errorType, ctx);
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
module.exports.INTERNAL_SEVER_ERROR_MESSAGE = INTERNAL_SEVER_ERROR_MESSAGE;
module.exports.NOT_FOUND_CODE = NOT_FOUND_CODE;
module.exports.NOT_FOUND_MESSAGE = NOT_FOUND_MESSAGE;
