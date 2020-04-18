// tslint:disable:max-classes-per-file

import { Collector } from '../collectors/collector.class';
import { FeatureNotAvailableException } from '../exceptions/feature-not-available.exception';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { Node } from './node.class';
import { register } from './nodes.register';
import { SqlLiteralNode } from './sql-literal.node';
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
// @register('bin')
// export class BinNode extends UnaryNode<unknown> {
// }

// todo: check purpose
// @register('cube')
// export class CubeNode extends UnaryNode<unknown> {
// }

/**
 * Renders a `DISTINCT ON` statement
 */
@register('distinct-on')
export class DistinctOnNode extends UnaryNode<unknown> {
  public visit(): void {
    throw new FeatureNotAvailableException('DISTINCT ON is not available for this database.');
  }
}

/**
 * Wrapper for a statement passed into `GROUP BY`
 */
@register('group')
export class GroupNode extends UnaryNode<AnyNodeOrAttribute> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // Because TypeScript
    // tslint:disable-next-line:no-unused-expression
    collector;
    visitChild(this.expression);
  }
}

// @register('grouping-element')
// todo: check purpose
// export class GroupingElementNode extends UnaryNode<unknown> {
// }

// @register('grouping-set')
// todo: check purpose
// export class GroupingSetNode extends UnaryNode<unknown> {
// }

/**
 * Renders a `LATERAL` statement
 */
@register('lateral')
export class LateralNode extends UnaryNode<unknown> {
  // todo implement for postgres
  public visit(): void {
    throw new FeatureNotAvailableException('LATERAL is not available for this database.');
  }
}

/**
 * Renders a `LIMIT` statement
 */
@register('limit')
export class LimitNode extends UnaryNode<QuotedNode<number>> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('LIMIT ');
    visitChild(this.expression);
  }
}

@register('lock')
export class LockNode extends UnaryNode<SqlLiteralNode> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // tslint:disable-next-line:no-unused-expression
    collector;
    visitChild(this.expression);
  }
}

/**
 * Renders a `NOT (...)` statement
 */
@register('not')
export class NotNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('NOT (');
    visitChild(this.expression);
    collector.add(')');
  }
}

/**
 * Renders an `OFFSET` statement
 */
@register('offset')
export class OffsetNode extends UnaryNode<QuotedNode<number>> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('OFFSET ');
    visitChild(this.expression);
  }
}

/**
 * Renders an `ON` statement
 */
@register('on')
export class OnNode<Constraint extends Node> extends UnaryNode<Constraint> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('ON ');
    visitChild(this.expression);
  }
}

/**
 * Renders optimizer hints
 */
@register('optimizer-hints')
export class OptimizerHintsNode extends UnaryNode<string[]> {
  public visit(collector: Collector<unknown>): void {
    const hints = this.expression.map(collector.adapter.sanitizeSqlComment).join(' ');
    collector.add(`/*+ ${hints} */`);
  }
}

// @register('rollup')
// todo: check purpose
// export class RollupNode extends UnaryNode<unknown> {
// }
