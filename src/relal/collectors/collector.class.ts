export abstract class Collector<ExportType> {
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
