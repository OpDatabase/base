import { Collector } from '../../collectors/collector.class';
import { UnknownNativeType } from '../../interfaces/node-types.interface';
import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

@register('quoted')
export class QuotedNode<ValueType extends UnknownNativeType> extends UnaryNode<ValueType> {
  public isNull(): boolean {
    return this.value === null;
  }

  public visit(collector: Collector<unknown>): void {
    collector.add(collector.adapter.quote(this.value));
  }

  // todo: is infinite
}
