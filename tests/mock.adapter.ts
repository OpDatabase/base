import {
  Base,
  BaseException,
  ConnectionPool,
  DatabaseAdapter,
  DatabaseAdapterConfigPayload,
  DatabaseClient,
  Logger,
  SqlQueryWithTransposedPlaceholders,
} from '../src/base';

export function provideMockAdapter() {
  beforeEach(() => {
    ConnectionPool.registerAdapter(MockAdapter);
  });
  afterEach(() => {
    Base.connectionPool.reset();
  });
}

export class MockAdapter implements DatabaseAdapter {
  private config: MockAdapterConfig | null = null;

  /**
   * Returns a new mock database client.
   */
  public async getConnection(): Promise<MockDatabaseClient> {
    if (this.config == null) {
      throw new MockAdapterException();
    }

    return new MockDatabaseClient(this.config);
  }

  /**
   * Returns the MockAdapter's identifier.
   */
  public getIdentifier(): string {
    return 'mock';
  }

  /**
   * Loads the given config.
   */
  public loadConfig(config: MockAdapterConfig): void {
    this.config = config;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class MockDatabaseClient implements DatabaseClient {
  /**
   * All SQL statements executed by this client.
   */
  public executedSqlStatement: string[] = [];

  constructor(
    private readonly config: MockAdapterConfig,
  ) {
  }

  /**
   * Mocks the execution of the given SQL statement.
   */
  public execute(input: SqlQueryWithTransposedPlaceholders): Promise<void> {
    if (this.config.simulate === 'failure') {
      throw new MockAdapterException();
    }
    Logger.debug('MOCK:', JSON.stringify(input));
    this.executedSqlStatement.push(input.statement);

    return Promise.resolve();
  }

  /**
   * Mocks disconnecting the connection
   */
  public release(): void {
    // Intentionally blank
  }
}

// tslint:disable-next-line:max-classes-per-file
export class MockAdapterException extends BaseException {
}

export interface MockAdapterConfig extends DatabaseAdapterConfigPayload {
  /**
   * Decides whether queries should fail or work.
   */
  simulate: 'success' | 'failure';
}
