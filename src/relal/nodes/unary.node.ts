// tslint:disable:max-classes-per-file

import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { Node } from './node.class';
import { register } from './nodes.register';
import { SqlLiteralNode } from './sql-literal-node';
import { QuotedNode } from './unary/quoted.node';

export abstract class UnaryNode<Type> extends Node {
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
// todo: check purpose
@register('bin')
export class BinNode extends UnaryNode<unknown> {
}

// todo: check purpose
@register('cube')
export class CubeNode extends UnaryNode<unknown> {
}

@register('distinct-on')
export class DistinctOnNode extends UnaryNode<unknown> {
}

// todo: likely not type Node
@register('group')
export class GroupNode extends UnaryNode<SqlLiteralNode | Node> {
}

@register('grouping-element')
// todo: check purpose
export class GroupingElementNode extends UnaryNode<unknown> {
}

@register('grouping-set')
// todo: check purpose
export class GroupingSetNode extends UnaryNode<unknown> {
}

@register('lateral')
export class LateralNode extends UnaryNode<unknown> {
}

@register('limit')
export class LimitNode extends UnaryNode<QuotedNode<number>> {
}

@register('lock')
// todo: check purpose
export class LockNode extends UnaryNode<unknown> {
}

@register('not')
export class NotNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
}

@register('offset')
export class OffsetNode extends UnaryNode<QuotedNode<number>> {
}

// todo: likely not type Node
@register('on')
export class OnNode<Constraint extends SqlLiteralNode | Node> extends UnaryNode<Constraint> {
}

@register('optimizer-hints')
export class OptimizerHintsNode extends UnaryNode<unknown[]> { // todo: likely string
}

@register('rollup')
// todo: check purpose
export class RollupNode extends UnaryNode<unknown> {
}
