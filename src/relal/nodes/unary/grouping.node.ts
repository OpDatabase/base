import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

// todo: typing
@register('grouping')
export class GroupingNode<Type extends { fetchAttribute(...args: unknown[]): unknown }> extends UnaryNode<Type> {
  public fetchAttribute(...args: unknown[]): unknown {
    return this.expression.fetchAttribute(args);
  }
}
