import { Node } from '..';

export class BindParamNode<ValueType> extends Node {
  constructor(
    public readonly value: ValueType | null,
  ) {
    super();
  }

  public isNull(): boolean {
    return this.value === null;
  }

  // todo is infinite, is unboundable
}
