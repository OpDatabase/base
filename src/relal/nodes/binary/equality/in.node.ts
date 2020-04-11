import { AnyNodeOrAttribute } from '../../../interfaces/node-types.interface';
import { NotInNode } from '../../binary.node';
import { node, register } from '../../nodes.register';
import { UnaryNode } from '../../unary.node';
import { EqualityNode } from '../equality.node';

@register('in')
export class InNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends EqualityNode<LhsType, RhsType> {
  private readonly notInNode: typeof NotInNode = node('not-in');

  public invert(): NotInNode<LhsType, RhsType> {
    return new this.notInNode(this.left, this.right);
  }
}

// tslint:disable-next-line:max-classes-per-file
@register('in-values')
export class InValuesNode<Type extends AnyNodeOrAttribute[]> extends UnaryNode<Type> {
}
