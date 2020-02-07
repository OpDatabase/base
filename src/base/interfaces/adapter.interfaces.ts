export interface DatabaseAdapter {
  getIdentifier(): string;

  loadConfig(config: DatabaseAdapterConfigPayload): void;

  getConnection(): Promise<DatabaseClient>;
}

export interface DatabaseClient {
  execute(input: SqlQueryWithTransposedPlaceholders): Promise<any>;

  resolvePlaceholders(statement: string, placeholders?: SqlQueryPlaceholders): SqlQueryWithTransposedPlaceholders;

  release(): void;
}

export interface SqlQueryPlaceholders {
  [placeholder: string]: any;
}

export interface DatabaseAdapterConfigPayload {
  [key: string]: any;
}

export type DatabaseAdapterConstructor<T extends DatabaseAdapter> = new() => T;

export interface SqlQueryWithTransposedPlaceholders {
  statement: string;
  inputPlaceholders: SqlQueryPlaceholders;
  transposedPlaceholders: any[];
  usedPlaceholders: string[];
}
