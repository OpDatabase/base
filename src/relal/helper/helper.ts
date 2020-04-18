import { Attribute } from '../attributes/attribute.class';
import { AnyNodeOrAttribute, ConvertibleToString, UnknownNativeType } from '../interfaces/node-types.interface';
import { InternalConstants } from '../internal-constants';
import { OrNode } from '../nodes/binary.node';
import { AndNode } from '../nodes/expressions/and.node';
import { CastedNode } from '../nodes/expressions/casted.node';
import { Node } from '../nodes/node.class';
import { node } from '../nodes/nodes.register';
import { GroupingNode } from '../nodes/unary/grouping.node';
import { QuotedNode } from '../nodes/unary/quoted.node';
import { sql } from './sql-template-handler.func';

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

    return new andNode(results);
  }
}

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
