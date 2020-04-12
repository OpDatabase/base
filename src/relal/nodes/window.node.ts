// tslint:disable:max-classes-per-file
import { Collector } from '../collectors/collector.class';
import { sql } from '../helper/sql-template-handler.func';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { Node } from './node.class';
import { register } from './nodes.register';
import { SqlLiteralNode } from './sql-literal-node';
import { UnaryNode } from './unary.node';
import { OrderingNode } from './unary/ordering.node';

/**
 * Renders a window containing `PARTITION BY` and/or `ORDER BY` statements
 */
@register('window')
export class WindowNode extends Node {
  public orders: Array<OrderingNode<AnyNodeOrAttribute> | SqlLiteralNode> = [];
  public framing: AnyNodeOrAttribute | null = null;
  public partitions: AnyNodeOrAttribute[] = [];

  public order(...expressions: Array<OrderingNode<AnyNodeOrAttribute> | string>): WindowNode {
    this.orders.push(...expressions.map(expression => {
      if (typeof expression === 'string') {
        return sql`${expression}`;
      } else {
        return expression;
      }
    }));

    return this;
  }

  public partition(...expressions: Array<string | AnyNodeOrAttribute>): WindowNode {
    this.partitions.push(...expressions.map(expression => {
      if (typeof expression === 'string') {
        return sql`${expression}`;
      } else {
        return expression;
      }
    }));

    return this;
  }

  public frame<T extends AnyNodeOrAttribute | null>(expression: T): T {
    return this.framing = expression;
  }

  public rows(expression: AnyNodeOrAttribute | null): RowsNode {
    if (this.framing != null) {
      return new RowsNode(expression);
    } else {
      return this.frame(new RowsNode(expression));
    }
  }

  public range(expression: AnyNodeOrAttribute | null): RangeNode {
    if (this.framing != null) {
      return new RangeNode(expression);
    } else {
      return this.frame(new RangeNode(expression));
    }
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('(');

    // Add partitions
    if (this.partitions.length > 0) {
      collector.add('PARTITION BY ');
      this.visitEach(this.partitions, ' ', collector, visitChild);
    }

    // Add orders
    if (this.orders.length > 0) {
      if (this.partitions.length > 0) {
        collector.add(' ');
      }
      collector.add('ORDER BY ');
      this.visitEach(this.orders, ', ', collector, visitChild);
    }

    // Add framing
    if (this.framing != null) {
      if (this.partitions.length > 0 || this.orders.length > 0) {
        collector.add(' ');
      }
      visitChild(this.framing);
    }

    collector.add(')');
  }
}

/**
 * Renders a named window.
 */
@register('named-window')
export class NamedWindowNode extends WindowNode {
  constructor(
    public readonly name: string,
  ) {
    super();
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add(collector.adapter.columnName(this.name));
    collector.add(' AS ');
    super.visit(collector, visitChild);
  }
}

/**
 * Renders a `ROWS` statement
 */
@register('rows')
export class RowsNode extends UnaryNode<AnyNodeOrAttribute | null> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    if (this.expression == null) {
      collector.add('ROWS');
    } else {
      collector.add('ROWS ');
      visitChild(this.expression);
    }
  }
}

/**
 * Renders a `RANGE` statement
 */
@register('range')
export class RangeNode extends UnaryNode<AnyNodeOrAttribute | null> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    if (this.expression == null) {
      collector.add('RANGE');
    } else {
      collector.add('RANGE ');
      visitChild(this.expression);
    }
  }
}

// todo: check purpose
// @register('current-row')
// export class CurrentRowNode extends Node {
// }

// todo: check purpose
// @register('preceding')
// export class PrecedingNode extends UnaryNode<unknown> {
// }

// todo: check purpose
// @register('following')
// export class FollowingNode extends UnaryNode<unknown> {
// }
