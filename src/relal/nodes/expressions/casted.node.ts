import { Attribute } from '../../attributes/attribute.class';
import { Collector } from '../../collectors/collector.class';
import { UnknownNativeType } from '../../interfaces/node-types.interface';
import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';

/**
 * Renders a given value (as UnknownNativeType) into the SQL statement
 * using a Type cast from the associated Attribute first.
 */
@register('casted')
export class CastedNode<ValueType extends UnknownNativeType> extends ExpressionsNode {
  constructor(
    public readonly value: ValueType,
    public readonly attribute: Attribute,
  ) {
    super();
  }

  public visit(collector: Collector<unknown>): void {
    collector.add(
      collector.adapter.quote(this.attribute.typeCastForDatabase(this.value)),
    );
  }
}
