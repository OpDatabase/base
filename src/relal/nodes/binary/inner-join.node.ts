import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { JoinNode } from '../binary.node';
import { Node } from '../node.class';
import { register } from '../nodes.register';
import { SelectCoreNode } from '../select-core.node';
import { SqlLiteralNode } from '../sql-literal-node';
import { OnNode } from '../unary.node';

/**
 * Renders an `INNER JOIN` statement.
 */
@register('inner-join')
export class InnerJoinNode<LhsType extends SelectCoreNode | SqlLiteralNode, RhsType extends OnNode<Node>> extends JoinNode<LhsType, RhsType> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('INNER JOIN ');
    visitChild(this.left);

    // Add right-hand side if given
    if (this.right != null) {
      collector.add(' ');
      visitChild(this.right);
    }
  }
}
