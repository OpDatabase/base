import { Collector } from '../../../collectors/collector.class';
import { AnyNodeOrAttribute, ConvertibleToString } from '../../../interfaces/node-types.interface';
import { register } from '../../nodes.register';
import { FunctionNode } from '../function.node';

/**
 * Renders a `COUNT(...)` statement.
 */
@register('count')
export class CountNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
  constructor(
    expression: Type,
    public readonly distinct: boolean = false,
    alias?: ConvertibleToString,
  ) {
    super(expression, alias);
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    this.visitAggregate('COUNT', collector, visitChild);
  }
}
