import { Collector } from '../../collectors/collector.class';
import { TableAliasNode } from '../../nodes/binary/table-alias.node';
import { Table } from '../../table.class';
import { Visitor, visitorFor } from '../visitor.class';

export abstract class ToSqlVisitor extends Visitor {
  // todo: link to connection

  public compile(node: unknown, collector: unknown): void {
    console.log(node, collector);
    // todo
  }

  @visitorFor(TableAliasNode)
  protected visitTableAliasNode(node: TableAliasNode<Table<unknown>>, collector: Collector<unknown>): void {
    // todo: move inside database adapter
    collector.add(node.relation.name);
    collector.add(' ');
    collector.add(node.name);
  }
}
