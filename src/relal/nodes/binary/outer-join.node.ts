import { JoinNode } from '../binary.node';
import { SelectCoreNode } from '../select-core.node';
import { SqlLiteralNode } from '../sql-literal-node';
import { OnNode } from '../unary.node';

export class OuterJoinNode<LhsType extends SelectCoreNode | SqlLiteralNode, RhsType extends OnNode | null> extends JoinNode<LhsType, RhsType> {
}
