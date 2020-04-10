import { Attribute } from '../attributes/attribute.class';
import { AnyNodeOrAttribute, ConvertibleToString, UnknownNativeType } from '../interfaces/node-types.interface';
import { OrNode } from '../nodes/binary.node';
import { TableAliasNode } from '../nodes/binary/table-alias.node';
import { AndNode } from '../nodes/expressions/and.node';
import { CastedNode } from '../nodes/expressions/casted.node';
import { SelectStatementNode } from '../nodes/expressions/select-statement.node';
import { Node } from '../nodes/node.class';
import { sql, SqlLiteralNode } from '../nodes/sql-literal-node';
import { GroupingNode } from '../nodes/unary/grouping.node';
import { QuotedNode } from '../nodes/unary/quoted.node';

export function createTableAlias(relation: SelectStatementNode, name: SqlLiteralNode): TableAliasNode<SelectStatementNode> {
  return new TableAliasNode(relation, name);
}

// todo: typing
export function grouping<Type extends Node>(expression: Type): GroupingNode {
  return new GroupingNode(expression);
}

export function groupingAny(expressions: unknown[]) {
  return new GroupingNode(expressions.reduce((previousValue, currentValue) => {
    return new OrNode(previousValue, currentValue);
  }));
}

export function groupingAll(expressions: unknown[]) {
  return new GroupingNode(new AndNode(expressions));
}

// todo: typing of Node
export function collapse(...expressions: Array<Node | string>): AndNode<unknown, unknown> | Node {
  const results: Node[] = [];
  for (const expression of expressions) {
    if (typeof expression === 'string') {
      results.push(sql`${expression}`);
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

/*
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
}*/

export function toString(input: ConvertibleToString): string {
  return typeof input === 'string' ? input : input.toString();
}

export function isNodeOrAttribute(value: unknown): value is AnyNodeOrAttribute {
  return (value instanceof Node || value instanceof Attribute);
}

export function buildQuoted<InputType extends UnknownNativeType>(other: InputType): QuotedNode<InputType>;
export function buildQuoted<InputType extends UnknownNativeType>(other: InputType, attribute: Attribute): CastedNode<InputType>;
export function buildQuoted<InputType extends UnknownNativeType>(
  other: InputType,
  attribute?: Attribute,
): QuotedNode<InputType> | CastedNode<InputType> {
  if (attribute == null) {
    return new QuotedNode(other);
  } else {
    return new CastedNode(other, attribute);
  }
}
