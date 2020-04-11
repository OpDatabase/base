import { Attribute, ExpressionsNode, UnknownNativeType } from '../..';

export class CastedNode<ValueType extends UnknownNativeType> extends ExpressionsNode {
  constructor(
    public readonly value: ValueType,
    public readonly attribute: Attribute,
  ) {
    super();
  }

  public isNull(): boolean {
    return this.value === null;
  }
}
