// tslint:disable:max-classes-per-file

import { AnyNodeOrAttribute, BinaryNode, NotEqualNode } from '../..';

export class EqualityNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  public readonly operator: string = '==';

  public invert(): NotEqualNode<LhsType, RhsType> {
    return new NotEqualNode(this.left, this.right);
  }

  public fetchAttribute(): void {
    super.fetchAttribute();
    // todo
  }
}

export class IsDistinctFromNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends EqualityNode<LhsType, RhsType> {
  public invert(): IsNotDistinctFromNode<LhsType, RhsType> {
    return new IsNotDistinctFromNode(this.left, this.right);
  }
}

export class IsNotDistinctFromNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends EqualityNode<LhsType, RhsType> {
  public invert(): IsDistinctFromNode<LhsType, RhsType> {
    return new IsDistinctFromNode(this.left, this.right);
  }
}
