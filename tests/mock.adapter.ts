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

  public stop(): void {
    // Intentionally blank
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
  public async execute<T>(input: SqlQueryWithTransposedPlaceholders): Promise<T[]> {
    if (this.config.simulate === 'failure') {
      throw new MockAdapterException();
    }
    Logger.debug('MOCK:', JSON.stringify(input));
    this.executedSqlStatement.push(input.statement);

    return [];
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
