import chalk = require('chalk');
import { ConsoleHandler, Logger } from './logger.class';

describe('Logger', () => {
  afterEach(() => Logger.defaultLogger = console);

  describe('logQuery', () => {
    it('should output the correct simple query statement - SELECT', async () => {
      mockConsole('log', chalk.grey('[MOCK]'), chalk.blue('SELECT * FROM test'));
      Logger.logQuery('[MOCK]', 'SELECT * FROM test', []);
    });
    it('should output the correct simple query statement - INSERT', async () => {
      mockConsole('log', chalk.grey('[MOCK]'), chalk.green('INSERT INTO a (id) VALUES (1)'));
      Logger.logQuery('[MOCK]', 'INSERT INTO a (id) VALUES (1)', []);
    });
    it('should output the correct simple query statement - UPDATE', async () => {
      mockConsole('log', chalk.grey('[MOCK]'), chalk.yellow('UPDATE a SET b = 1 WHERE 1=1'));
      Logger.logQuery('[MOCK]', 'UPDATE a SET b = 1 WHERE 1=1', []);
    });
    it('should output the correct simple query statement - DELETE', async () => {
      mockConsole('log', chalk.grey('[MOCK]'), chalk.red('DELETE FROM a WHERE 1=1'));
      Logger.logQuery('[MOCK]', 'DELETE FROM a WHERE 1=1', []);
    });
    it('should output the correct simple query statement - BEGIN', async () => {
      mockConsole('log', chalk.grey('[MOCK]'), chalk.magenta('BEGIN'));
      Logger.logQuery('[MOCK]', 'BEGIN', []);
    });
    it('should output the correct simple query statement - ROLLBACK', async () => {
      mockConsole('log', chalk.grey('[MOCK]'), chalk.magenta('ROLLBACK'));
      Logger.logQuery('[MOCK]', 'ROLLBACK', []);
    });
    it('should output the correct simple query statement - COMMIT', async () => {
      mockConsole('log', chalk.grey('[MOCK]'), chalk.magenta('COMMIT'));
      Logger.logQuery('[MOCK]', 'COMMIT', []);
    });
    it('should output the correct simple query statement - other', async () => {
      mockConsole('log', chalk.grey('[MOCK]'), chalk.blue('ABC'));
      Logger.logQuery('[MOCK]', 'ABC', []);
    });
    it('should output the correct complex query statement', async () => {
      const placeholderSuffixes: string[] = [];
      const data = [{ name: '$1', value: 1 }, { name: '$2', value: 'abc' }, { name: '$3', value: null }];
      for (const placeholder of data) {
        placeholderSuffixes.push(`(${placeholder.name}) ${chalk.black.bold(placeholder.value == null ? 'NULL' : placeholder.value.toString())}`);
      }
      mockConsole('log', chalk.grey('[MOCK]'), chalk.blue('SELECT * FROM test WHERE a = $1 AND b = $2 AND c = $3'), chalk.grey(`[${placeholderSuffixes.join(', ')}]`));
      Logger.logQuery('[MOCK]', 'SELECT * FROM test WHERE a = $1 AND b = $2 AND c = $3', data);
    });
  });

  describe('error', () => {
    it('should output the correct error statement', async () => {
      mockConsole('error', chalk.bgRed.white('ERROR'));
      Logger.error('ERROR');
    });
  });

  describe('debug', () => {
    it('should output the correct debug statement', async () => {
      mockConsole('debug', chalk.grey('DEBUG'));
      Logger.debug('DEBUG');
    });
  });

  describe('info', () => {
    it('should output the correct debug statement', async () => {
      mockConsole('info', chalk.blue('INFO'));
      Logger.info('INFO');
    });
  });

  describe('warn', () => {
    it('should output the correct debug statement', async () => {
      mockConsole('warn', chalk.bgYellow.black('WARN'));
      Logger.warn('WARN');
    });
  });
});

function mockConsole(expectedMethod: keyof ConsoleHandler, ...expectedResponse: unknown[]) {
  const validateCallback = (method: keyof ConsoleHandler, ...response: unknown[]) => {
    expect(method).toBe(expectedMethod);
    for (let i = 0; i < expectedResponse.length; i++) {
      expect(response[i]).toBe(expectedResponse[i]);
    }
  };

  class FakeLogger implements ConsoleHandler {
    /**
     * Mocks the debug statement.
     */
    public debug(...args: unknown[]): void {
      validateCallback('debug', ...args);
    }

    /**
     * Mocks the error statement.
     */
    public error(...args: unknown[]): void {
      validateCallback('error', ...args);
    }

    /**
     * Mocks the log statement.
     */
    public log(...args: unknown[]): void {
      validateCallback('log', ...args);
    }

    public info(...args: unknown[]): void {
      validateCallback('info', ...args);
    }

    public warn(...args: unknown[]): void {
      validateCallback('warn', ...args);
    }
  }

  Logger.defaultLogger = new FakeLogger();
}
