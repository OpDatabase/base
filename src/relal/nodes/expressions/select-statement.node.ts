import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';
import { SelectCoreNode } from '../select-core.node';
import { SqlLiteralNode } from '../sql-literal.node';
import { LimitNode, LockNode, OffsetNode } from '../unary.node';
import { OrderingNode } from '../unary/ordering.node';
import { WithNode } from '../unary/with.node';

/**
 * Renders the foundation of a `SELECT` statement, including `ORDER BY`, `LIMIT`, `OFFSET` and `LOCK`.
 * Calls of the individual statements itself are done by the {@link SelectCoreNode} class.
 */
@register('select-statement')
export class SelectStatementNode extends ExpressionsNode {
  public orders: Array<SqlLiteralNode | OrderingNode<AnyNodeOrAttribute>> = [];
  public limit: LimitNode | null = null;
  public lock: LockNode | null = null;
  public offset: OffsetNode | null = null;
  public with: WithNode | null = null;
  public core: SelectCoreNode = new SelectCoreNode();

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // Render WITH statement if given
    if (this.with != null) {
      visitChild(this.with);
      collector.add(' ');
    }

    // Render every SelectCoreNode
    visitChild(this.core);

    // Render ORDER BY statements
    if (this.orders.length > 0) {
      collector.add(' ORDER BY ');
      this.visitEach(this.orders, ', ', collector, visitChild);
    }

    // Render LIMIT statement
    if (this.limit != null) {
      collector.add(' ');
      visitChild(this.limit);
    }

    // Render OFFSET statement
    if (this.offset != null) {
      collector.add(' ');
      visitChild(this.offset);
    }

    // Render LOCK statement
    if (this.lock != null) {
      collector.add(' ');
      visitChild(this.lock);
    }
  }
}
