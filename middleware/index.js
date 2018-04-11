const INTERNAL_SEVER_ERROR_CODE = 500;
const INTERNAL_SEVER_ERROR_MESSAGE = 'Internal Server Error';
const NOT_FOUND_CODE = 404;
const NOT_FOUND_MESSAGE = 'Not Found';

const handleError = (
  app,
  // (error, errorType, ctx) => void
  onError,
  // (warning, warningType) => void
  onWarning
) => {
  if (typeof onError !== 'function') {
    throw new TypeError('onError must be a function');
  }

  if (typeof onWarning !== 'function') {
    throw new TypeError('onWarning must be a function');
  }

  const processError = (err, errorType, ctx) => {
    if (ctx) {
      if (
        (ctx.body === undefined && ctx.request.method !== 'OPTIONS') ||
        (ctx.body !== undefined &&
          ctx.body._readableState !== undefined &&
          ctx.body._readableState.ended === false)
      ) {
        ctx.status = NOT_FOUND_CODE;
        ctx.body = NOT_FOUND_MESSAGE;
      } else {
        ctx.status = INTERNAL_SEVER_ERROR_CODE;
        ctx.body = INTERNAL_SEVER_ERROR_MESSAGE;
      }
    }

    onError(err, errorType, ctx);
  };

  const processWarning = (warning, warningType) => {
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

  return async (ctx, next) => {
    await next();
  };
};

module.exports = handleError;
module.exports.default = handleError;
module.exports.INTERNAL_SEVER_ERROR_CODE = INTERNAL_SEVER_ERROR_CODE;
module.exports.INTERNAL_SEVER_ERROR_MESSAGE = INTERNAL_SEVER_ERROR_MESSAGE;
module.exports.NOT_FOUND_CODE = NOT_FOUND_CODE;
module.exports.NOT_FOUND_MESSAGE = NOT_FOUND_MESSAGE;
