// tslint:disable:max-classes-per-file
import { Node } from './node.class';
import { rawSql } from './sql-literal-node';
import { UnaryNode } from './unary.node';

export class WindowNode extends Node {
  public orders: Node[] = []; // todo likely not Node[]
  public framing: unknown | null = null;
  public partitions: Node[] = []; // todo likely not Node[]

  public order(...expressions: Array<string | Node>): WindowNode { // todo: type Node
    this.orders.push(...expressions.map(expression => {
      if (typeof expression === 'string') {
        return rawSql`${expression}`;
      } else {
        return expression;
      }
    }));

    return this;
  }

  public partition(...expressions: Array<string | Node>): WindowNode { // todo: type Node
    this.partitions.push(...expressions.map(expression => {
      if (typeof expression === 'string') {
        return rawSql`${expression}`;
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

export class NamedWindowNode extends WindowNode {
  constructor(
    public readonly name: string,
  ) {
    super();
  }
}

export class RowsNode extends UnaryNode<unknown> {
}

export class RangeNode extends UnaryNode<unknown> {
}

export class CurrentRowNode extends Node {
}

export class PrecedingNode extends UnaryNode<unknown> {
}

export class FollowingNode extends UnaryNode<unknown> {
}
