import { Collector } from '../collectors/collector.class';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { TableWithAlias } from '../table-with-alias.class';
import { Table } from '../table.class';
import { JoinNode } from './binary.node';
import { CommentNode } from './comment.node';
import { DistinctNode } from './expressions/distinct.node';
import { JoinSourceNode } from './join-source.node';
import { Node } from './node.class';
import { node, register } from './nodes.register';
import { SqlLiteralNode } from './sql-literal.node';
import { DistinctOnNode, GroupNode, OnNode, OptimizerHintsNode } from './unary.node';
import { NamedWindowNode } from './window.node';

export type SourceType = JoinSourceNode<Table<unknown> | TableWithAlias<unknown>, JoinNode<SelectCoreNode | SqlLiteralNode, OnNode<Node>>>;

/**
 * Renders the SELECT statement
 */
@register('select-core')
export class SelectCoreNode extends Node {
  public projections: AnyNodeOrAttribute[] = [];
  public wheres: Node[] = [];
  public groups: GroupNode[] = [];
  public windows: NamedWindowNode[] = [];
  public comment: CommentNode | null = null;
  public havings: Node[] = [];
  public source: SourceType = new (node('join-source'))();
  public setQuantifier: DistinctNode | DistinctOnNode | null = null;
  public optimizerHints: OptimizerHintsNode | null = null;

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('SELECT ');

    // Add optimizer hints
    if (this.optimizerHints != null) {
      visitChild(this.optimizerHints);
    }

    // Add set quantifiers
    if (this.setQuantifier != null) {
      visitChild(this.setQuantifier);
    }

    // Projections
    this.visitEach(this.projections, ', ', collector, visitChild);

    // Source
    if (!this.source.isEmpty()) {
      collector.add(' FROM ');
      visitChild(this.source);
    }

    // Wheres
    if (this.wheres.length > 0) {
      collector.add(' WHERE ');
      this.visitEach(this.wheres, ' AND ', collector, visitChild);
    }

    // Group by
    if (this.groups.length > 0) {
      this.visitEach(this.groups, ' GROUP BY ', collector, visitChild);
    }

    // Havings
    if (this.havings.length > 0) {
      collector.add(' HAVING ');
      this.visitEach(this.havings, ' AND ', collector, visitChild);
    }

    // todo windows

    // Comment
    if (this.comment != null) {
      visitChild(this.comment);
    }
  }
}
