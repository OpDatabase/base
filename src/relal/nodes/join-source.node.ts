import { Collector } from '../collectors/collector.class';
import { sql } from '../helper/sql-template-handler.func';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { InternalConstants } from '../internal-constants';
import { Table } from '../table.class';
import { JoinNode } from './binary.node';
import { Node } from './node.class';
import { register } from './nodes.register';
import { SelectCoreNode } from './select-core.node';
import { SqlLiteralNode } from './sql-literal-node';
import { OnNode } from './unary.node';

@register('join-source')
export class JoinSource<SingleSource extends Table<unknown> | SqlLiteralNode,
  JoinOption extends JoinNode<SelectCoreNode | SqlLiteralNode, OnNode<Node>>> extends Node {
  public left: SingleSource | undefined;
  public right: JoinOption[] = [];

  constructor() {
    super();
  }

  public isEmpty(): boolean {
    return this.left == null && this.right.length === 0;
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    if (this.left != null) {
      if (this.left instanceof InternalConstants.tableClass) {
        // todo: implement visit into Table
        visitChild(sql`${collector.adapter.tableName(this.left.name)}`); // todo: alias
      } else {
        visitChild(this.left as SqlLiteralNode);
      }
    }

    if (this.right.length > 0) {
      if (this.left != null) {
        collector.add(' ');
      }
      this.visitEach(this.right, ' ', collector, visitChild);
    }
  }
}
