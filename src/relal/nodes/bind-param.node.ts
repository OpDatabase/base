import { Collector } from '../collectors/collector.class';
import { Node } from './node.class';
import { register } from './nodes.register';

@register('bind-param')
export class BindParamNode<ValueType> extends Node {
  constructor(
    public readonly value: ValueType | null,
  ) {
    super();
  }

  public visit(collector: Collector<unknown>): void {
    collector.add(collector.bind(this.value));
  }
}
