import { Node } from './node.class';
import { register } from './nodes.register';

// todo: check purpose
@register('bind-param')
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
