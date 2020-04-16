import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { JoinNode } from '../binary.node';
import { Node } from '../node.class';
import { register } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { OnNode } from '../unary.node';

/**
 * Renders a user-specific JOIN statement.
 */
@register('string-join')
export class StringJoinNode extends JoinNode<SqlLiteralNode, OnNode<Node>> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // Because Typescript
    // tslint:disable-next-line:no-unused-expression
    collector;
    visitChild(this.left);
  }
}
