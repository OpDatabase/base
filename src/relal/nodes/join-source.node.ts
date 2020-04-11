import { Table } from '../table.class';
import { JoinNode } from './binary.node';
import { Node } from './node.class';
import { register } from './nodes.register';
import { SelectCoreNode } from './select-core.node';
import { SqlLiteralNode } from './sql-literal-node';
import { OnNode } from './unary.node';

@register('join-source')
export class JoinSource<SingleSource extends Table<unknown> | SqlLiteralNode,
  JoinOption extends JoinNode<SelectCoreNode | SqlLiteralNode, OnNode<Node> | null>> extends Node {
  public left: SingleSource | undefined;
  public right: JoinOption[] = [];

  constructor() {
    super();
  }
}
