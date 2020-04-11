import { Attribute } from '../../attributes/attribute.class';
import { UnknownNativeType } from '../../interfaces/node-types.interface';
import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';

@register('casted')
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
