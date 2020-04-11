import { Collector } from './collector.class';

export class SqlStringCollector extends Collector<string> {
  private value: string = '';
  private bindIndex: number = 1;

  public add(partial: string): void {
    this.value += partial;
  }

  public bind(): string {
    // Add bindings
    const index = this.bindIndex;
    this.bindIndex++;
    this.add(`$placeholder${index}`);

    return `$placeholder${index}`;
  }

  public export(): string {
    return this.value;
  }
}
