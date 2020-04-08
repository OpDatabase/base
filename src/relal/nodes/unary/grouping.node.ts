import { UnaryNode } from '../unary.node';

// todo: typing
export class GroupingNode extends UnaryNode<{ fetchAttribute(...args: unknown[]): unknown }> {
  public fetchAttribute(...args: unknown[]): unknown {
    return this.expression.fetchAttribute(args);
  }
}
