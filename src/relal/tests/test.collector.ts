import { Collector } from '../collectors/collector.class';

export class TestCollector extends Collector<string> {
  public value: string = '';
  public bindIndex: number = 0;
  public boundValues: unknown[] = [];

  constructor() {
    super({
      quote: inputValue => `${inputValue}`,
      sanitizeSqlComment: inputValue => inputValue,
      tableName: inputValue => `"${inputValue}"`,
      columnName: inputValue => `"${inputValue}"`,
    });
  }

  public add(partial: string): void {
    this.value += partial;
  }

  public bind(value: unknown): string {
    this.boundValues.push(value);
    const index = this.bindIndex;
    this.bindIndex++;

    return `$placeholder${index}`;
  }

  public export(): string {
    return this.value;
  }
}

