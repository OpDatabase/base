import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { BinaryNode } from '../binary.node';
import { node, register } from '../nodes.register';
import { QuotedNode } from '../unary/quoted.node';

/**
 * Renders an `field LIKE value` statement.
 * If `escape` is given, `ESCAPE value` is added.
 */
@register('matches')
export class MatchesNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  constructor(
    left: LhsType,
    right: RhsType,
    public readonly escape: string | null = null,
    public readonly caseSensitive: boolean = false,
  ) {
    super(left, right);
  }

  // todo: postgres: ILIKE
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    collector.add(' LIKE ');
    visitChild(this.right);

    if (this.escape != null) {
      const quotedNode: typeof QuotedNode = node('quoted');
      collector.add(' ESCAPE ');
      visitChild(new quotedNode(this.escape));
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
@register('does-not-match')
export class DoesNotMatchNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends MatchesNode<LhsType, RhsType> {
  // todo: postgres: ILIKE
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    collector.add(' NOT LIKE ');
    visitChild(this.right);

    if (this.escape != null) {
      const quotedNode: typeof QuotedNode = node('quoted');
      collector.add(' ESCAPE ');
      visitChild(new quotedNode(this.escape));
    }
  }
}
