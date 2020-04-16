// tslint:disable:max-classes-per-file

import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { BinaryNode, NotEqualNode } from '../binary.node';
import { node, register } from '../nodes.register';

/**
 * Renders an "is equal to" statement (`field1 = value`).
 * If the right-hand side is null, this will be rendered as `field IS NULL`.
 */
@register('equality')
export class EqualityNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType | null> {
  public readonly operator: string = '==';

  public invert(): NotEqualNode<LhsType, RhsType> {
    const notEqualNode: typeof NotEqualNode = node('not-equal');

    return new notEqualNode(this.left, this.right);
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    if (this.right === null) {
      collector.add(' IS NULL');
    } else {
      collector.add(' = ');
      visitChild(this.right);
    }
  }
}

/**
 * Renders an "is distinct from" statement, which also is able to handle null values properly.
 * If the right-hand side is null, this will be rendered as `field IS NOT NULL`.
 */
@register('is-distinct-from')
export class IsDistinctFromNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends EqualityNode<LhsType, RhsType> {
  public invert(): IsNotDistinctFromNode<LhsType, RhsType> {
    return new IsNotDistinctFromNode(this.left, this.right);
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    if (this.right === null) {
      visitChild(this.left);
      collector.add(' IS NOT NULL');
    } else {
      isDistinctFrom(this.left, this.right, collector, visitChild);
      collector.add(' = 1');
    }
  }
}

/**
 * Renders an "is not distinct from" statement, which also is able to handle null values properly.
 * If the right-hand side is null, this will be rendered as `field IS NULL`.
 */
@register('is-not-distinct-from')
export class IsNotDistinctFromNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends EqualityNode<LhsType, RhsType> {
  public invert(): IsDistinctFromNode<LhsType, RhsType> {
    return new IsDistinctFromNode(this.left, this.right);
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    if (this.right === null) {
      visitChild(this.left);
      collector.add(' IS NULL');
    } else {
      isDistinctFrom(this.left, this.right, collector, visitChild);
      collector.add(' = 0');
    }
  }
}

function isDistinctFrom<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>(
  left: LhsType,
  right: RhsType,
  collector: Collector<unknown>,
  visitChild: (element: AnyNodeOrAttribute) => void,
): void {
  collector.add('CASE WHEN ');
  visitChild(left);
  collector.add(' = ');
  visitChild(right);
  collector.add(' OR (');
  visitChild(left);
  collector.add(' IS NULL AND ');
  visitChild(right);
  collector.add(' IS NULL) THEN 0 ELSE 1 END');
}
