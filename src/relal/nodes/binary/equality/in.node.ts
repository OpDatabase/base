import { AnyNodeOrAttribute, EqualityNode, NotInNode, UnaryNode } from '../../..';

export class InNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends EqualityNode<LhsType, RhsType> {
  public invert(): NotInNode<LhsType, RhsType> {
    return new NotInNode(this.left, this.right);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class InValuesNode<Type extends AnyNodeOrAttribute[]> extends UnaryNode<Type> {
}
