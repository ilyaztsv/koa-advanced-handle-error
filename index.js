// @flow

import Application from 'koa';
import type { Context } from 'koa';
import type { Middleware } from 'koa';

export const INTERNAL_SEVER_ERROR_CODE: number = 500;
export const ERROR_MESSAGE: string = 'An error occurred';

export default (
  app: Application,
  onError: (error: any) => void,
  onWarning: (warning: any) => void
): Middleware => {
  if (typeof onError !== 'function') {
    throw new TypeError('onError must be a function');
  }

  if (typeof onWarning !== 'function') {
    throw new TypeError('onWarning must be a function');
  }

  const processError = (err: any, ctx?: Context) => {
    if (ctx) {
      ctx.status = err.statusCode || err.status || INTERNAL_SEVER_ERROR_CODE;
      ctx.body = ERROR_MESSAGE;
    }

    onError(err);
  };

  const processWarning = (warning: Error) => {
    onWarning(warning);
  };

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.app.emit('error', err, ctx);
    }
  });

  app.on('error', (err, ctx) => {
    processError(err, ctx);
  });

  process.on('unhandledRejection', (err, promise) => {
    throw err;
  });

  process.on('rejectionHandled', promise => {
    throw new Error('rejectionHandled: ' + arguments[2].toString());
  });

  process.on('uncaughtException', err => {
    processError(err);
    process.exit(1);
  });

  process.on('warning', warning => {
    processWarning(warning);
  });

  return async (ctx: Context, next) => {
    await next();
  };
};
