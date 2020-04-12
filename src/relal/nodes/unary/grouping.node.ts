import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { Node } from '../node.class';
import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

/**
 * Renders parenthesis around the child nodes.
 */
@register('grouping')
export class GroupingNode<Type extends Node> extends UnaryNode<Type> {
  // todo: check relevance
  // public fetchAttribute(...args: unknown[]): unknown {
  //   return this.expression.fetchAttribute(args);
  // }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // Check if inner node is another GroupingNode
    if (this.value instanceof GroupingNode) {
      // Skip this and head directly to child
      visitChild(this.value);
    } else {
      // Add parenthesis around child
      collector.add('(');
      visitChild(this.value);
      collector.add(')');
    }
  }
}
