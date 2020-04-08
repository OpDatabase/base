import { Attribute } from '../attributes/attribute.class';
import { TableAliasNode } from '../nodes/binary/table-alias.node';
import { BindParamNode } from '../nodes/bind-param.node';
import { AndNode } from '../nodes/expressions/and.node';
import { CastedNode } from '../nodes/expressions/casted.node';
import { SelectStatementNode } from '../nodes/expressions/select-statement.node';
import { Node } from '../nodes/node.class';
import { rawSql, SqlLiteralNode } from '../nodes/sql-literal-node';
import { GroupingNode } from '../nodes/unary/grouping.node';
import { QuotedNode } from '../nodes/unary/quoted.node';
import { SelectManager } from '../select-manager.class';
import { Table } from '../table.class';

export function createTableAlias(relation: SelectStatementNode, name: SqlLiteralNode): TableAliasNode<SelectStatementNode> {
  return new TableAliasNode(relation, name);
}

// todo: typing
export function grouping<Type extends Node>(expression: Type): GroupingNode {
  return new GroupingNode(expression);
}

// todo: typing of Node
export function collapse(...expressions: Array<Node | string>): AndNode<unknown, unknown> | Node {
  const results: Node[] = [];
  for (const expression of expressions) {
    if (typeof expression === 'string') {
      results.push(rawSql`${expression}`);
    } else {
      results.push(expression);
    }
  }

  if (results.length === 1) {
    return results[0];
  } else {
    return new AndNode(results as any); // todo
  }
}

export function buildQuoted(other: Node): Node;
export function buildQuoted(other: Attribute): Attribute;
export function buildQuoted<Schema>(other: Table<Schema>): Table<Schema>;
export function buildQuoted(other: SelectManager): SelectManager;
export function buildQuoted<ValueType>(other: BindParamNode<ValueType>): BindParamNode<ValueType>;
export function buildQuoted<ValueType>(other: QuotedNode<ValueType>): QuotedNode<ValueType>;
export function buildQuoted(other: SqlLiteralNode): SqlLiteralNode;
export function buildQuoted<ValueType>(other: ValueType, attribute: Attribute): CastedNode<ValueType>;
export function buildQuoted<ValueType>(other: ValueType): QuotedNode<ValueType>;
export function buildQuoted<SchemaOrType>(
  other: Node | Attribute | Table<SchemaOrType> | SelectManager | BindParamNode<SchemaOrType> | QuotedNode<SchemaOrType> | SqlLiteralNode | unknown,
  attribute?: Attribute,
): Node | Attribute | Table<SchemaOrType> | SelectManager |
  BindParamNode<SchemaOrType> | QuotedNode<SchemaOrType> |
  SqlLiteralNode | CastedNode<SchemaOrType> {
  if (
    other instanceof Node || other instanceof Attribute || other instanceof Table ||
    other instanceof SelectManager || other instanceof BindParamNode ||
    other instanceof QuotedNode || other instanceof SqlLiteralNode
  ) {
    return other;
  } else {
    if (attribute instanceof Attribute) {
      return new CastedNode(other, attribute);
    } else {
      return new QuotedNode(other);
    }
  }
}
