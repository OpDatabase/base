export abstract class Collector<ExportType> {

  constructor(
    public readonly adapter: CollectorAdapter,
  ) {
  }

  /**
   * Adds a partial SQL snippet from a visitor
   * @param partial
   */
  public abstract add(partial: string): void;

  /**
   * Binds a given value, should return a placeholder.
   * @param value
   */
  public abstract bind(value: unknown): string;

  /**
   * Exports the current value of the collector.
   */
  public abstract export(): ExportType;
}

export interface CollectorAdapter {
  // todo add @connection methods
  quote(inputValue: unknown): string;

  sanitizeSqlComment(inputValue: string): string;

  tableName(inputValue: string): string;

  columnName(inputValue: string): string;
}
