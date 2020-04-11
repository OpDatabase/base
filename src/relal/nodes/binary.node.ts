// tslint:disable:max-classes-per-file
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { SelectStatementNode } from './expressions/select-statement.node';
import { Node } from './node.class';
import { register } from './nodes.register';
import { SelectCoreNode } from './select-core.node';
import { SqlLiteralNode } from './sql-literal-node';
import { OnNode } from './unary.node';

export abstract class BinaryNode<LhsType, RhsType> extends Node {
  constructor(
    public left: LhsType,
    public right: RhsType,
  ) {
    super();
  }

  // todo FetchAttribute
}

// Binary nodes
@register('between')
export class BetweenNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
}

@register('not-in')
export class NotInNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

@register('greater-than')
export class GreaterThanNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

@register('greater-than-or-equal')
export class GreaterThanOrEqualNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

@register('not-equal')
export class NotEqualNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

@register('less-than')
export class LessThanNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

@register('less-than-or-equal')
export class LessThanOrEqualNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

@register('or')
export class OrNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
}

@register('as')
export class AsNode<LhsType extends AnyNodeOrAttribute, RhsType extends SqlLiteralNode> extends BinaryNode<LhsType, RhsType> {
}

// todo check purpose
@register('assignment')
export class AssignmentNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
}

// todo: OnNode<Node>
@register('join')
export class JoinNode<LhsType extends SelectCoreNode | SqlLiteralNode, RhsType extends OnNode<Node> | null> extends BinaryNode<LhsType, RhsType> {
}

@register('union')
export class UnionNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}

@register('union-all')
export class UnionAllNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}

@register('intersect')
export class IntersectNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}

@register('expect')
export class ExceptNode extends BinaryNode<SelectStatementNode, SelectStatementNode> {
}
