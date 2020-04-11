// tslint:disable:max-classes-per-file

import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { BinaryNode, NotEqualNode } from '../binary.node';
import { node, register } from '../nodes.register';

@register('equality')
export class EqualityNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  public readonly operator: string = '==';

  public invert(): NotEqualNode<LhsType, RhsType> {
    const notEqualNode: typeof NotEqualNode = node('not-equal');

    return new notEqualNode(this.left, this.right);
  }

  public fetchAttribute(): void {
    super.fetchAttribute();
    // todo
  }
}

@register('is-distinct-from')
export class IsDistinctFromNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends EqualityNode<LhsType, RhsType> {
  public invert(): IsNotDistinctFromNode<LhsType, RhsType> {
    return new IsNotDistinctFromNode(this.left, this.right);
  }
}

@register('is-not-distinct-from')
export class IsNotDistinctFromNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends EqualityNode<LhsType, RhsType> {
  public invert(): IsDistinctFromNode<LhsType, RhsType> {
    return new IsDistinctFromNode(this.left, this.right);
  }
}
