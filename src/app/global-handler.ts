import { ErrorHandler, Injectable } from '@angular/core';

enum Level {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

interface DivMessage {
  level: Level;
  datetime: Date;
  message?: string;
  error?: Error;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  logMessages: DivMessage[] = [];

  constructor() {}

  debug(msg: string) {
    this.logMessages.push({
      level: Level.debug,
      datetime: new Date(),
      message: msg,
      error: undefined,
    });
  }

  info(msg: string) {
    this.logMessages.push({
      level: Level.info,
      datetime: new Date(),
      message: msg,
      error: undefined,
    });
  }

  warn(msg: string) {
    this.logMessages.push({
      level: Level.warn,
      datetime: new Date(),
      message: msg,
      error: undefined,
    });
  }

  error(err?: Error, msg?: string) {
    this.logMessages.push({
      level: Level.error,
      datetime: new Date(),
      message: msg,
      error: err,
    });
    if (msg) {
      console.log(msg);
    }
    if (err) {
      console.log(err.stack);
    }
  }
}

@Injectable()
export class GlobalHandler implements ErrorHandler {
  constructor(private errorService: ErrorService) {}
  handleError(err: Error) {
    this.errorService.error(err, 'UNCAUGHT EXCEPTION');
  }
}
