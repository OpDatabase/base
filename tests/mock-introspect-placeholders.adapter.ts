import {
  Base,
  ConnectionPool,
  DatabaseAdapter,
  DatabaseAdapterConfigPayload,
  DatabaseClient,
  SqlQueryPlaceholders,
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
  }

  // tslint:disable-next-line:max-classes-per-file
  class MockIntrospectDatabaseClient implements DatabaseClient {
    public async execute(input: SqlQueryWithTransposedPlaceholders): Promise<void> {
      callback(input);
    }

    public release(): void {
      // Intentionally blank
    }

    public resolvePlaceholders(statement: string, placeholders?: SqlQueryPlaceholders): SqlQueryWithTransposedPlaceholders {
      return {
        statement,
        inputPlaceholders: placeholders || {},
        transposedPlaceholders: Object.keys(placeholders || {}),
        usedPlaceholders: Object.keys(placeholders || {}),
      };
    }
  }

  ConnectionPool.registerAdapter(MockIntrospectPlaceholdersAdapter);
  Base.connectionPool.connect({ adapter: 'mock-introspect-placeholders' });

  return await Base.connectionPool.getConnection();
}
