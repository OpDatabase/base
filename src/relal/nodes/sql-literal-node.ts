import { ConvertibleToString } from '../interfaces/node-types.interface';
import { Node } from './node.class';

/**
 * This node is converted "as is" into an SQL string.
 * There is no escaping / quoting whatsoever.
 * Therefore: Use with caution.
 */
export class SqlLiteralNode extends Node {
  // todo: implements Expressions, Predications, AliasPredications, OrderPredications, MathMethods
  // todo: extend String?

  constructor(
    public readonly value: ConvertibleToString,
  ) {
    super();
  }
}

export function sql(literals: TemplateStringsArray, ...args: unknown[]): SqlLiteralNode {
  return new SqlLiteralNode(String.raw(literals, args));
}
