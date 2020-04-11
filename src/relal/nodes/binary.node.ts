// tslint:disable:max-classes-per-file
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { SelectStatementNode } from './expressions/select-statement.node';
import { Node } from './node.class';
import { SelectCoreNode } from './select-core.node';
import { SqlLiteralNode } from './sql-literal-node';
import { OnNode } from './unary.node';

export class BinaryNode<LhsType, RhsType> extends Node {
  constructor(
    public left: LhsType,
    public right: RhsType,
  ) {
    super();
  }

  // todo FetchAttribute
}

// Binary nodes
export class BetweenNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
}

export class NotInNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

export class GreaterThanNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

export class GreaterThanOrEqualNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

export class NotEqualNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

export class LessThanNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

export class LessThanOrEqualNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

export class OrNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
}

export class AsNode<LhsType extends AnyNodeOrAttribute, RhsType extends SqlLiteralNode> extends BinaryNode<LhsType, RhsType> {
}

export class AssignmentNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

// todo: OnNode<Node>
export class JoinNode<LhsType extends SelectCoreNode | SqlLiteralNode, RhsType extends OnNode<Node> | null> extends BinaryNode<LhsType, RhsType> {
}

export class UnionNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}

export class UnionAllNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}

export class IntersectNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}

export class ExceptNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}
