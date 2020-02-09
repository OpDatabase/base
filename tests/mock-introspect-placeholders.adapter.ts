import {
  Base,
  ConnectionPool,
  DatabaseAdapter,
  DatabaseAdapterConfigPayload,
  DatabaseClient,
  SqlQueryWithTransposedPlaceholders,
} from '../src/base';

export async function provideIntrospectPlaceholdersAdapter(
  callback: (passedPlaceholders: SqlQueryWithTransposedPlaceholders) => void,
): Promise<DatabaseClient> {
  class MockIntrospectPlaceholdersAdapter implements DatabaseAdapter {
    public getIdentifier(): string {
      return 'mock-introspect-placeholders';
    }

    public loadConfig(config: DatabaseAdapterConfigPayload): void {
      // Intentionally blank
      (() => config)();
    }

    public async getConnection(): Promise<MockIntrospectDatabaseClient> {
      return new MockIntrospectDatabaseClient();
    }

    public stop(): void {
      // Intentionally blank
    }
  }

  // tslint:disable-next-line:max-classes-per-file
  class MockIntrospectDatabaseClient implements DatabaseClient {
    public async execute(input: SqlQueryWithTransposedPlaceholders): Promise<void> {
      callback(input);
    }

    public release(): void {
      // Intentionally blank
    }

    public placeholderReplacementHandler(mark: number): string {
      return `@${mark}`;
    }
  }

  ConnectionPool.registerAdapter(MockIntrospectPlaceholdersAdapter);
  Base.connectionPool.connect({ adapter: 'mock-introspect-placeholders' });

  return await Base.connectionPool.getConnection();
}
