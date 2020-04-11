import { JoinNode } from '../binary.node';
import { Node } from '../node.class';
import { register } from '../nodes.register';
import { SelectCoreNode } from '../select-core.node';
import { SqlLiteralNode } from '../sql-literal-node';
import { OnNode } from '../unary.node';

// todo OnNode<Node>
@register('outer-join')
export class OuterJoinNode<LhsType extends SelectCoreNode | SqlLiteralNode, RhsType extends OnNode<Node> | null> extends JoinNode<LhsType, RhsType> {
}
