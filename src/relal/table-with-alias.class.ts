import { Attribute } from './attributes/attribute.class';
import { UnknownAttribute } from './attributes/unknown-attribute.class';
import { Collector } from './collectors/collector.class';
import { InternalConstants } from './internal-constants';
import { FullOuterJoinNode } from './nodes/binary/full-outer-join.node';
import { InnerJoinNode } from './nodes/binary/inner-join.node';
import { OuterJoinNode } from './nodes/binary/outer-join.node';
import { Node } from './nodes/node.class';
import { node } from './nodes/nodes.register';
import { SelectCoreNode } from './nodes/select-core.node';
import { SqlLiteralNode } from './nodes/sql-literal-node';
import { OrderingNode } from './nodes/unary/ordering.node';
import { SelectManager } from './select-manager.class';
import { Table } from './table.class';

export class TableWithAlias<Schema> implements Table<Schema> {
  constructor(
    public readonly name: string,
    public readonly original: Table<Schema>,
    // private readonly typeCaster: TypeCasterInterface = new DefaultTypeCaster(),
  ) {
  }

  public as(name: string): TableWithAlias<Schema> {
    return new TableWithAlias(name, this.original);
  }

  public from(): SelectManager<Schema> {
    return new SelectManager(this);
  }

  public join<LhsType extends SelectCoreNode | SqlLiteralNode>(
    relation: string | LhsType,
    method: typeof InnerJoinNode | typeof OuterJoinNode | typeof FullOuterJoinNode = node('inner-join') as typeof InnerJoinNode,
  ): SelectManager<Schema> {
    return this.from().join(relation, method);
  }

  public outerJoin(relation: string | SqlLiteralNode | SelectCoreNode): SelectManager<Schema> {
    return this.join(relation, node('outer-join'));
  }

  public group(...columns: Array<string | Node>): SelectManager<Schema> {
    return this.from().group(...columns);
  }

  public order(...expressions: Array<string | OrderingNode<Node>>): SelectManager<Schema> {
    return this.from().order(...expressions);
  }

  public where(condition: Node): SelectManager<Schema> {
    return this.from().where(condition);
  }

  public project(...things: Array<string | Node>): SelectManager<Schema> {
    return this.from().project(...things);
  }

  public take(amount: number): unknown {
    return this.from().take(amount);
  }

  public skip(amount: number): unknown {
    return this.from().skip(amount);
  }

  public having(expression: Node): SelectManager<Schema> {
    return this.from().having(expression);
  }

  public attribute(name: string): Attribute {
    // todo
    return new UnknownAttribute(this, name);
  }

  public visit(collector: Collector<unknown>): void {
    collector.add(collector.adapter.tableName(this.original.name));
    collector.add(' AS ');
    collector.add(collector.adapter.tableName(this.name));
  }
}

InternalConstants.tableWithAliasClass = TableWithAlias;
