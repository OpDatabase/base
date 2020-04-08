import { Table } from '../table.class';
import { BinaryNode, JoinNode } from './binary.node';
import { DistinctNode } from './expressions/distinct.node';
import { Node } from './node.class';
import { SqlLiteralNode } from './sql-literal-node';
import { DistinctOnNode, GroupNode, OptimizerHintsNode } from './unary.node';
import { NamedWindowNode } from './window.node';

export class SelectCoreNode extends Node {
  public projections: unknown[];
  public wheres: unknown[];
  public groups: GroupNode[] = [];
  public windows: NamedWindowNode[] = [];
  public comment: unknown;
  public havings: unknown[];
  public source: BinaryNode<SelectCoreNode | SqlLiteralNode | Table<unknown>, Array<JoinNode<unknown, unknown>>>; // todo maybe
  public setQuantifier: DistinctNode | DistinctOnNode | null = null;
  public optimizerHints: OptimizerHintsNode | null = null;
}
