export interface DatabaseAdapter {
  /**
   * Returns the identifier of the database adapter.
   */
  getIdentifier(): string;

  /**
   * Loads the given database configuration payload.
   */
  loadConfig(config: DatabaseAdapterConfigPayload): void;

  /**
   * Returns the database client connection.
   */
  getConnection(): Promise<DatabaseClient>;
}

export interface DatabaseClient {
  /**
   * Executes the given SQL statement, returning any value.
   */
  // tslint:disable-next-line:no-any
  execute(input: SqlQueryWithTransposedPlaceholders): Promise<any>;

  /**
   * Resolves the given statement and placeholder for a database client specific SQL string.
   */
  resolvePlaceholders(statement: string, placeholders?: SqlQueryPlaceholders): SqlQueryWithTransposedPlaceholders;

  /**
   * Releases the connection.
   */
  release(): void;
}

export interface SqlQueryPlaceholders {
  // tslint:disable-next-line:no-any
  [placeholder: string]: any;
}

export interface DatabaseAdapterConfigPayload {
  // tslint:disable-next-line:no-any
  [key: string]: any;
}

export interface DatabaseAdapterDeclaration {
  /**
   * The identifier of the adapter to be used.
   */
  adapter: string;
}

export type DatabaseAdapterConstructor<T extends DatabaseAdapter> = new() => T;

export interface SqlQueryWithTransposedPlaceholders {
  /**
   * The SQL statement to be executed.
   */
  statement: string;

  /**
   * The placeholders that have been used as input.
   */
  inputPlaceholders: SqlQueryPlaceholders;

  /**
   * The transposed placeholders.
   */
  // tslint:disable-next-line:no-any
  transposedPlaceholders: any[];

  /**
   * The placeholders that have been used.
   */
  usedPlaceholders: string[];
}