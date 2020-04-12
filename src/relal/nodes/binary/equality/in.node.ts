import { Collector } from '../../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../../interfaces/node-types.interface';
import { NotInNode } from '../../binary.node';
import { node, register } from '../../nodes.register';
import { UnaryNode } from '../../unary.node';
import { EqualityNode } from '../equality.node';

/**
 * Renders an `IN (...)` statement.
 * If the right-hand side is InValuesNode, all values will be rendered within as comma separated values.
 * If the right-hand side is empty or null, 1=0 will be added to the SQL statement.
 */
@register('in')
export class InNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends EqualityNode<LhsType, RhsType> {
  private readonly notInNode: typeof NotInNode = node('not-in');

  public invert(): NotInNode<LhsType, RhsType> {
    return new this.notInNode(this.left, this.right);
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    if ((this.right instanceof InValuesNode && this.right.value.length === 0) || this.right === null) {
      collector.add(' 1=0 ');
    } else {
      visitChild(this.left);
      collector.add(' IN (');
      visitChild(this.right);
      collector.add(')');
    }
  }
}

/**
 * Renders values within an `IN(...)` statement separated by comma.
 */
// tslint:disable-next-line:max-classes-per-file
@register('in-values')
export class InValuesNode<Type extends AnyNodeOrAttribute[]> extends UnaryNode<Type> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    this.visitEach(this.value, ', ', collector, visitChild);
  }
}
