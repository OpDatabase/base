import chalk = require('chalk');

/**
 * OpDB Logger class
 */
export class Logger {
  /**
   * The logger that shall be used for printing out information.
   */
  public static defaultLogger: ConsoleHandler = console;

  /**
   * Logs the execution of an SQL query.
   */
  // tslint:disable-next-line:no-any
  public static logQuery(prefix: string, sql: string, placeholdersWithName: LogQueryPlaceholderPayload[]) {
    const firstExpression = sql.replace(/ .*/, '').toLowerCase();
    const queryPrefix = chalk.grey(prefix);
    const placeholderSuffixes: string[] = [];

    for (const placeholder of placeholdersWithName) {
      // tslint:disable-next-line:no-any
      placeholderSuffixes.push(`(${placeholder.name}) ${chalk.black.bold(placeholder.value.toString())}`);
    }

    const log = (value: string) => {
      if (placeholderSuffixes.length > 0) {
        this.defaultLogger.log(
          queryPrefix,
          value,
          chalk.grey(`[${placeholderSuffixes.join(', ')}]`),
        );
      } else {
        this.defaultLogger.log(
          queryPrefix,
          value,
        );
      }
    };

    switch (firstExpression) {
      case 'select':
        log(chalk.blue(sql));
        break;

      case 'insert':
        log(chalk.green(sql));
        break;

      case 'update':
        log(chalk.yellow(sql));
        break;

      case 'delete':
        log(chalk.red(sql));
        break;

      case 'begin':
      case 'rollback':
      case 'commit':
        log(chalk.magenta(sql));
        break;

      default:
        log(chalk.blue(sql));
        break;
    }
  }

  /**
   * Logs an error.
   */
  // tslint:disable-next-line:no-any
  public static error(...params: any[]) {
    this.defaultLogger.error(chalk.bgRed.white(...params));
  }

  /**
   * Logs an debug statement.
   */
  // tslint:disable-next-line:no-any
  public static debug(...params: any[]) {
    this.defaultLogger.debug(chalk.grey(...params));
  }
}

export interface LogQueryPlaceholderPayload {
  /**
   * The name of the placeholder.
   */
  name: string;

  /**
   * The value the placeholder will be exchanged for.
   */
  value: { toString(): string };
}

export interface ConsoleHandler {
  /**
   * Default console output.
   */
  // tslint:disable-next-line:no-any
  log(...args: any[]): any;

  /**
   * Error console output.
   */
  // tslint:disable-next-line:no-any
  error(...args: any[]): any;

  /**
   * Debug console output.
   */
  // tslint:disable-next-line:no-any
  debug(...args: any[]): any;
}
