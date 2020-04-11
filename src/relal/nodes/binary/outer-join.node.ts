import { JoinNode, Node, OnNode, SelectCoreNode, SqlLiteralNode } from '../..';

// todo OnNode<Node>
export class OuterJoinNode<LhsType extends SelectCoreNode | SqlLiteralNode, RhsType extends OnNode<Node> | null> extends JoinNode<LhsType, RhsType> {
}
