// tslint:disable:max-classes-per-file
import { SelectStatementNode } from './expressions/select-statement.node';
import { SelectCoreNode } from './select-core.node';
import { SqlLiteralNode } from './sql-literal-node';
import { OnNode } from './unary.node';

export class BinaryNode<LhsType, RhsType> {
  constructor(
    public left: LhsType,
    public right: RhsType,
  ) {
  }

  // todo FetchAttribute
}

// Binary nodes
export class BetweenNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
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

export class OrNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

export class AsNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

export class AssignmentNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

export class JoinNode<LhsType extends SelectCoreNode | SqlLiteralNode, RhsType extends OnNode | null> extends BinaryNode<LhsType, RhsType> {
}

export class UnionNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}

export class UnionAllNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}

export class IntersectNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}

export class ExceptNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}
