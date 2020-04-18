import { Collector } from '../collectors/collector.class';
import { VisitInterface } from '../interfaces/visit.interface';
import { TableWithAlias } from '../table-with-alias.class';
import { Table } from '../table.class';
import { JoinNode } from './binary.node';
import { Node } from './node.class';
import { register } from './nodes.register';
import { SqlLiteralNode } from './sql-literal.node';
import { OnNode } from './unary.node';

@register('join-source')
export class JoinSourceNode<SingleSource extends Table<unknown> | TableWithAlias<unknown>,
  JoinOption extends JoinNode<Table<unknown> | TableWithAlias<unknown> | SqlLiteralNode, OnNode<Node>>> extends Node {
  public left: SingleSource | undefined;
  public right: JoinOption[] = [];

  constructor() {
    super();
  }

  public isEmpty(): boolean {
    return this.left == null && this.right.length === 0;
  }

  public visit(collector: Collector<unknown>, visitChild: (element: VisitInterface) => void): void {
    if (this.left != null) {
      visitChild(this.left);
    }

    if (this.right.length > 0) {
      if (this.left != null) {
        collector.add(' ');
      }
      this.visitEach(this.right, ' ', collector, visitChild);
    }
  }
}
