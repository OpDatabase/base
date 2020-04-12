import { Collector } from '../../collectors/collector.class';
import { toString } from '../../helper/helper';
import { AnyNodeOrAttribute, ConvertibleToString } from '../../interfaces/node-types.interface';
import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

/**
 * Renders an `EXTRACT` statement like `EXTRACT(YEAR FROM dateField)`
 */
@register('extract')
export class ExtractNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
  constructor(
    expression: Type,
    public readonly field: ConvertibleToString,
  ) {
    super(expression);
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    const field = toString(this.field);
    collector.add(`EXTRACT(${field} FROM `);
    visitChild(this.expression);
    collector.add(')');
  }
}
