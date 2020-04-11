import { node } from '../nodes/nodes.register';
import { SqlLiteralNode } from '../nodes/sql-literal-node';

export function sql(literals: TemplateStringsArray, ...args: unknown[]): SqlLiteralNode {
  const sqlLiteralNode = node('sql-literal');

  return new sqlLiteralNode(String.raw(literals, args));
}
