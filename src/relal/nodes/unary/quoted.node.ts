import { UnaryNode } from '../unary.node';

export class QuotedNode<ValueType> extends UnaryNode<ValueType | null> {
  public isNull(): boolean {
    return this.value === null;
  }

  // todo: is infinite
}
