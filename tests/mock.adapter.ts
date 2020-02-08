import {
  Base,
  ConnectionPool,
  DatabaseAdapter,
  DatabaseAdapterConfigPayload,
  DatabaseClient,
  Logger,
  SqlQueryPlaceholders,
  SqlQueryWithTransposedPlaceholders,
} from '../src/base';
import { BaseException } from '../src/base/exceptions/exception';

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

    return Promise.resolve();
  }

  /**
   * Mocks disconnecting the connection
   */
  public release(): void {
    // Intentionally blank
  }

  /**
   * Mocks resolving the placeholders for the given SQL statement.
   */
  public resolvePlaceholders(statement: string, placeholders?: SqlQueryPlaceholders): SqlQueryWithTransposedPlaceholders {
    return {
      statement,
      inputPlaceholders: placeholders || {},
      transposedPlaceholders: [],
      usedPlaceholders: [],
    };
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
