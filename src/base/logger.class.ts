import chalk = require('chalk');

export class Logger {
  public static defaultLogger = console;

  public static logQuery(prefix: string, sql: string, placeholdersWithName: Array<{ name: string, value: any }>) {
    const firstExpression = sql.replace(/ .*/, '').toLowerCase();
    const queryPrefix = chalk.grey(prefix);
    const placeholderSuffixes: string[] = [];

    for (const placeholder of placeholdersWithName) {
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

  public static error(...params: any[]) {
    this.defaultLogger.error(chalk.bgRed.white(...params));
  }

  public static debug(...params: any[]) {
    this.defaultLogger.debug(chalk.grey(...params));
  }
}
