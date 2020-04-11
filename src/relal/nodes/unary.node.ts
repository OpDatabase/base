// tslint:disable:max-classes-per-file

import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { Node } from './node.class';
import { SqlLiteralNode } from './sql-literal-node';
import { QuotedNode } from './unary/quoted.node';

export class UnaryNode<Type> extends Node {
  constructor(
    public readonly value: Type,
  ) {
    super();
  }

  public get expression(): Type {
    return this.value;
  }
}

// Unary node types

export class BinNode extends UnaryNode<unknown> {
}

export class CubeNode extends UnaryNode<unknown> {
}

export class DistinctOnNode extends UnaryNode<unknown> {
}

// todo: likely not type Node
export class GroupNode extends UnaryNode<SqlLiteralNode | Node> {
}

export class GroupingElementNode extends UnaryNode<unknown> {
}

export class GroupingSetNode extends UnaryNode<unknown> {
}

export class LateralNode extends UnaryNode<unknown> {
}

export class LimitNode extends UnaryNode<QuotedNode<number>> {
}

export class LockNode extends UnaryNode<unknown> {
}

export class NotNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
}

export class OffsetNode extends UnaryNode<QuotedNode<number>> {
}

// todo: likely not type Node
export class OnNode<Constraint extends SqlLiteralNode | Node> extends UnaryNode<Constraint> {
}

export class OptimizerHintsNode extends UnaryNode<unknown[]> { // todo: likely string
}

export class RollupNode extends UnaryNode<unknown> {
}
