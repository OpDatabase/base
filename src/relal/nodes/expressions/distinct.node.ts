import { Collector } from '../../collectors/collector.class';
import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';

/**
 * Renders a `DISTINCT` expression
 */
@register('distinct')
export class DistinctNode extends ExpressionsNode {
  public visit(collector: Collector<unknown>): void {
    collector.add('DISTINCT');
  }
}
