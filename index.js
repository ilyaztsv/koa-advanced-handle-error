// @flow

import Application from 'koa';
import type { Context } from 'koa';
import type { Middleware } from 'koa';

type ErrorType =
  | 'process:uncaughtException'
  | 'process:rejectionHandled'
  | 'process:unhandledRejection'
  | 'app:error';

type WarningType = 'process:warning';

export const INTERNAL_SEVER_ERROR_CODE: number = 500;
export const ERROR_MESSAGE: string = 'An error occurred';

export default (
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
