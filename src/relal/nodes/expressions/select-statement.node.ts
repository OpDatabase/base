import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';
import { SelectCoreNode } from '../select-core.node';
import { SqlLiteralNode } from '../sql-literal.node';
import { OffsetNode } from '../unary.node';
import { OrderingNode } from '../unary/ordering.node';

/**
 * Renders the foundation of a `SELECT` statement, including `ORDER BY`, `LIMIT`, `OFFSET` and `LOCK`.
 * Calls of the individual statements itself are done by the {@link SelectCoreNode} class.
 */
@register('select-statement')
export class SelectStatementNode extends ExpressionsNode {
  public orders: Array<SqlLiteralNode | OrderingNode<AnyNodeOrAttribute>> = [];
  public limit: unknown | null = null; // todo SQL LIMIT
  public lock: unknown | null = null; // todo SQL LOCK
  public offset: OffsetNode | null = null; // todo SQL OFFSET

  // todo: SQL WITH statement
  public with: unknown | null = null;

  constructor(
    public cores: SelectCoreNode[] = [new SelectCoreNode()],
  ) {
    super();
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // Render WITH statement if given
    if (this.with != null) {
      // todo: SQL WITH statement visitChild(this.with);
      collector.add(' ');
    }

    // Render every SelectCoreNode
    this.cores.forEach(visitChild);

    // Render ORDER BY statements
    if (this.orders.length > 0) {
      collector.add('ORDER BY ');
      this.visitEach(this.orders, ', ', collector, visitChild);
    }

    // Render LIMIT statement
    if (this.limit != null) {
      collector.add(' ');
      // todo visitChild(this.limit);
    }

    // Render OFFSET statement
    if (this.offset != null) {
      collector.add(' ');
      // todo visitChild(this.limit);
    }

    // Render LOCK statement
    if (this.lock != null) {
      collector.add(' ');
      // todo visitChild(this.limit);
    }
  }
}
