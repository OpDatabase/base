// tslint:disable:max-classes-per-file
import { sql } from '../helper/sql-template-handler.func';
import { Node } from './node.class';
import { register } from './nodes.register';
import { UnaryNode } from './unary.node';

@register('window')
export class WindowNode extends Node {
  public orders: Node[] = []; // todo likely not Node[]
  public framing: unknown | null = null;
  public partitions: Node[] = []; // todo likely not Node[]

  public order(...expressions: Array<string | Node>): WindowNode { // todo: type Node
    this.orders.push(...expressions.map(expression => {
      if (typeof expression === 'string') {
        return sql`${expression}`;
      } else {
        return expression;
      }
    }));

    return this;
  }

  public partition(...expressions: Array<string | Node>): WindowNode { // todo: type Node
    this.partitions.push(...expressions.map(expression => {
      if (typeof expression === 'string') {
        return sql`${expression}`;
      } else {
        return expression;
      }
    }));

    return this;
  }

  public frame<T extends unknown | null>(expression: T): T { // todo likely RowsNode or RangeNode
    return this.framing = expression;
  }

  public rows(expression: unknown | null): RowsNode {
    if (this.framing != null) {
      return new RowsNode(expression);
    } else {
      return this.frame(new RowsNode(expression));
    }
  }

  public range(expression: unknown | null): RangeNode {
    if (this.framing != null) {
      return new RangeNode(expression);
    } else {
      return this.frame(new RangeNode(expression));
    }
  }
}

@register('named-window')
export class NamedWindowNode extends WindowNode {
  constructor(
    public readonly name: string,
  ) {
    super();
  }
}

@register('rows')
export class RowsNode extends UnaryNode<unknown> {
}

@register('range')
export class RangeNode extends UnaryNode<unknown> {
}

// todo: check purpose
@register('current-row')
export class CurrentRowNode extends Node {
}

// todo: check purpose
@register('preceding')
export class PrecedingNode extends UnaryNode<unknown> {
}

// todo: check purpose
@register('following')
export class FollowingNode extends UnaryNode<unknown> {
}
