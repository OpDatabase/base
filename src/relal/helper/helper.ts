import { Attribute } from '../attributes/attribute.class';
import { AnyNodeOrAttribute, ConvertibleToString, UnknownNativeType } from '../interfaces/node-types.interface';
import { InternalConstants } from '../internal-constants';
import { OrNode } from '../nodes/binary.node';
import { TableAliasNode } from '../nodes/binary/table-alias.node';
import { AndNode } from '../nodes/expressions/and.node';
import { CastedNode } from '../nodes/expressions/casted.node';
import { SelectStatementNode } from '../nodes/expressions/select-statement.node';
import { Node } from '../nodes/node.class';
import { node } from '../nodes/nodes.register';
import { SqlLiteralNode } from '../nodes/sql-literal-node';
import { GroupingNode } from '../nodes/unary/grouping.node';
import { QuotedNode } from '../nodes/unary/quoted.node';
import { Table } from '../table.class';
import { sql } from './sql-template-handler.func';

export function createTableAlias(relation: SelectStatementNode, name: SqlLiteralNode): TableAliasNode<SqlLiteralNode | Table<unknown>> {
  const tableAliasNode: typeof TableAliasNode = node('table-alias');

  // todo
  // @ts-ignore
  return new tableAliasNode(relation, name);
}

// todo: typing
export function grouping<Type extends Node>(expression: Type): GroupingNode<Type> {
  const groupingNode: typeof GroupingNode = node('grouping');

  return new groupingNode(expression);
}

export function groupingAny(expressions: Node[]): GroupingNode<OrNode<Node, Node>> {
  const groupingNode: typeof GroupingNode = node('grouping');
  const orNode: typeof OrNode = node('or');
  const flattened = expressions.reduce((previousValue, currentValue) => new orNode(previousValue, currentValue)) as OrNode<Node, Node>;

  return new groupingNode(flattened);
}

export function groupingAll(expressions: Node[]): GroupingNode<AndNode<Node[]>> {
  const groupingNode: typeof GroupingNode = node('grouping');
  const andNode: typeof AndNode = node('and');

  return new groupingNode(new andNode(expressions));
}

// todo: typing of Node
export function collapse(...expressions: Array<Node | string>): AndNode<Node[]> | Node {
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
    const andNode: typeof AndNode = node('and');

    return new andNode(results); // todo
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
  return (value instanceof InternalConstants.nodeClass || value instanceof InternalConstants.attributeClass);
}

export function buildQuoted<InputType extends UnknownNativeType>(other: InputType): QuotedNode<InputType>;
export function buildQuoted<InputType extends UnknownNativeType>(other: InputType, attribute: Attribute): CastedNode<InputType>;
export function buildQuoted<InputType extends UnknownNativeType>(
  other: InputType,
  attribute?: Attribute,
): QuotedNode<InputType> | CastedNode<InputType> {
  if (attribute == null) {
    const quotedNode: typeof QuotedNode = node('quoted');

    return new quotedNode(other);
  } else {
    const castedNode: typeof CastedNode = node('casted');

    return new castedNode(other, attribute);
  }
}

export function castOrQuote<InputType extends UnknownNativeType>(
  other: InputType,
  maybeAttribute: AnyNodeOrAttribute,
): QuotedNode<InputType> | CastedNode<InputType> {
  return maybeAttribute instanceof InternalConstants.attributeClass ? buildQuoted(other, maybeAttribute) : buildQuoted(other);
}
