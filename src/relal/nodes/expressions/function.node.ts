// tslint:disable:max-classes-per-file
import { Collector } from '../../collectors/collector.class';
import { toString } from '../../helper/helper';
import { AnyNodeOrAttribute, ConvertibleToString } from '../../interfaces/node-types.interface';
import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';

export abstract class FunctionNode<Type extends AnyNodeOrAttribute> extends ExpressionsNode {
  public readonly distinct: boolean = false;

  // todo: WindowPredications
  constructor(
    public readonly expression: Type, // todo: SelectStatementNode
    public alias?: ConvertibleToString,
  ) {
    super();
  }

  // todo: as (type mismatch)
  public as2(alias: ConvertibleToString): this {
    this.alias = alias;

    return this;
  }

  protected visitAggregate(method: string, collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add(`${method}(`);

    // Eventually add "DISTINCT"
    if (this.distinct) {
      collector.add('DISTINCT ');
    }

    // todo: check if handling multiple values is possible
    visitChild(this.expression);
    collector.add(')');

    // Eventually add "AS"
    if (this.alias != null) {
      collector.add(' AS ');
      // todo: quote column name
      collector.add(toString(this.alias));
    }
  }
}

/**
 * Renders a `SUM(...)` statement.
 */
@register('sum')
export class SumNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    this.visitAggregate('SUM', collector, visitChild);
  }
}

/**
 * Renders an `EXISTS (...)` statement.
 */
@register('exists')
export class ExistsNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('EXISTS (');
    visitChild(this.expression);
    collector.add(')');

    // Eventually add "AS"
    if (this.alias != null) {
      collector.add(' AS ');
      // todo: quote column name
      collector.add(toString(this.alias));
    }
  }
}

/**
 * Renders a `MAX(...)` statement.
 */
@register('max')
export class MaxNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    this.visitAggregate('MAX', collector, visitChild);
  }
}

/**
 * Renders a `MIN(...)` statement.
 */
@register('min')
export class MinNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    this.visitAggregate('MIN', collector, visitChild);
  }
}

/**
 * Renders an `AVG(...)` statement.
 */
@register('avg')
export class AvgNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    this.visitAggregate('AVG', collector, visitChild);
  }
}
