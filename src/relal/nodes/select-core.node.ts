import { DistinctNode } from './expressions/distinct.node';
import { Node } from './node.class';
import { register } from './nodes.register';
import { DistinctOnNode, GroupNode, OptimizerHintsNode } from './unary.node';
import { NamedWindowNode } from './window.node';

@register('select-core')
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
