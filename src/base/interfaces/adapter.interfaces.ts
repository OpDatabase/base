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

  /**
   * Stops the database connection, intended for internal use
   * @internal
   */
  stop(): Promise<void> | void;
}

export interface DatabaseClient {
  /**
   * Executes the given SQL statement, returning any value.
   */
  execute<T>(input: SqlQueryWithTransposedPlaceholders): Promise<T[]>;

  /**
   * Releases the connection.
   */
  release(): void;

  /**
   * If given, this replacement handler will be used instead of the built-in replacement
   * handler for placeholders inside the SQL statement.
   */
  placeholderReplacementHandler?(mark: number): string;
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
