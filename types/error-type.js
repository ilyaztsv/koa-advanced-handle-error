// @flow

export type ErrorType =
  | 'process:uncaughtException'
  | 'process:rejectionHandled'
  | 'process:unhandledRejection'
  | 'app:error';
