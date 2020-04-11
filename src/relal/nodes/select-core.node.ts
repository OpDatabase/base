import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { Table } from '../table.class';
import { JoinNode } from './binary.node';
import { DistinctNode } from './expressions/distinct.node';
import { JoinSource } from './join-source.node';
import { Node } from './node.class';
import { node, register } from './nodes.register';
import { SqlLiteralNode } from './sql-literal-node';
import { DistinctOnNode, GroupNode, OnNode, OptimizerHintsNode } from './unary.node';
import { NamedWindowNode } from './window.node';

export type SourceType = JoinSource<Table<unknown> | SqlLiteralNode, JoinNode<SelectCoreNode | SqlLiteralNode, OnNode<Node> | null>>;

@register('select-core')
export class SelectCoreNode extends Node {
  public projections: AnyNodeOrAttribute[] = [];
  public wheres: Node[] = [];
  public groups: GroupNode[] = [];
  public windows: NamedWindowNode[] = [];
  public comment: unknown;
  public havings: unknown[] = [];
  public source: SourceType = new (node('join-source'))();
  public setQuantifier: DistinctNode | DistinctOnNode | null = null;
  public optimizerHints: OptimizerHintsNode | null = null;
}
