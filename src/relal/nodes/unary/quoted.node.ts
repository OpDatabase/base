import { UnknownNativeType } from '../../interfaces/node-types.interface';
import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

@register('quoted')
export class QuotedNode<ValueType extends UnknownNativeType> extends UnaryNode<ValueType> {
  public isNull(): boolean {
    return this.value === null;
  }

  // todo: is infinite
}
