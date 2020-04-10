import { UnknownNativeType } from '../../interfaces/node-types.interface';
import { UnaryNode } from '../unary.node';

export class QuotedNode<ValueType extends UnknownNativeType> extends UnaryNode<ValueType> {
  public isNull(): boolean {
    return this.value === null;
  }

  // todo: is infinite
}
