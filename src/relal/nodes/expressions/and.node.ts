import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';

/**
 * Renders an `AND` statement, combining 1-n statements together.
 */
@register('and')
export class AndNode<ChildTypes extends AnyNodeOrAttribute[]> extends ExpressionsNode {
  constructor(
    public readonly children: ChildTypes,
  ) {
    super();
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    this.visitEach(this.children, ' AND ', collector, visitChild);
  }
}
