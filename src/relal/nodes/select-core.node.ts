import { DistinctNode, DistinctOnNode, GroupNode, NamedWindowNode, Node, OptimizerHintsNode } from '..';

export class SelectCoreNode extends Node {
  public projections: unknown[] = [];
  public wheres: unknown[] = [];
  public groups: GroupNode[] = [];
  public windows: NamedWindowNode[] = [];
  public comment: unknown;
  public havings: unknown[] = [];
  public source: any; // todo maybe
  public setQuantifier: DistinctNode | DistinctOnNode | null = null;
  public optimizerHints: OptimizerHintsNode | null = null;
}
