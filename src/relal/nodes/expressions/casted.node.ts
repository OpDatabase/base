import { Attribute } from '../../attributes/attribute.class';
import { ExpressionsNode } from '../expressions.node';

export class CastedNode<ValueType> extends ExpressionsNode {
  constructor(
    public readonly value: ValueType | null,
    public readonly attribute: Attribute | null,
  ) {
    super();
  }

  public isNull(): boolean {
    return this.value === null;
  }
}
