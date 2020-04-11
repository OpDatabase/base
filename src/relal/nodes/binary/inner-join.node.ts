import { JoinNode, Node, OnNode, SelectCoreNode, SqlLiteralNode } from '../..';

// todo OnNode<Node>
export class InnerJoinNode<LhsType extends SelectCoreNode | SqlLiteralNode, RhsType extends OnNode<Node> | null> extends JoinNode<LhsType, RhsType> {
}
