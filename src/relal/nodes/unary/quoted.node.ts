import { UnaryNode, UnknownNativeType } from '../..';

export class QuotedNode<ValueType extends UnknownNativeType> extends UnaryNode<ValueType> {
  public isNull(): boolean {
    return this.value === null;
  }

  // todo: is infinite
}
