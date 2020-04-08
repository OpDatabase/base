import { Node } from './node.class';

export class SqlLiteralNode extends Node {
  // todo: implements Expressions, Predications, AliasPredications, OrderPredications, MathMethods
  // todo: extend String?

  constructor(
    public readonly rawSql: string,
  ) {
    super();
  }
}

export function rawSql(literals: TemplateStringsArray, ...args: unknown[]): SqlLiteralNode {
  return new SqlLiteralNode(String.raw(literals, args));
}
