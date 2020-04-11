import { AliasPredications, ConvertibleToString, Expressions, include, MathMethods, Node, OrderPredications, Predications } from '..';

/**
 * This node is converted "as is" into an SQL string.
 * There is no escaping / quoting whatsoever.
 * Therefore: Use with caution.
 */
@include(AliasPredications, Expressions, MathMethods, OrderPredications, Predications)
export class SqlLiteralNode extends Node {
  constructor(
    public readonly value: ConvertibleToString,
  ) {
    super();
  }
}

export interface SqlLiteralNode
  extends Node, AliasPredications<SqlLiteralNode>,
    Expressions<SqlLiteralNode>, MathMethods<SqlLiteralNode>,
    OrderPredications<SqlLiteralNode>, Predications<SqlLiteralNode> {
}

export function sql(literals: TemplateStringsArray, ...args: unknown[]): SqlLiteralNode {
  return new SqlLiteralNode(String.raw(literals, args));
}
