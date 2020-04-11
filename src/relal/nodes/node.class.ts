import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { OrNode } from './binary.node';
import { AndNode } from './expressions/and.node';
import { node } from './nodes.register';
import { NotNode } from './unary.node';

export abstract class Node {
  public fetchAttribute(): void {
    // Intentionally blank
  }

  public not(): NotNode<this> {
    const notNode: typeof NotNode = node('not');

    return new notNode(this);
  }

  public or<OtherType extends AnyNodeOrAttribute>(other: OtherType): OrNode<this, OtherType> {
    const orNode: typeof OrNode = node('or');

    return new orNode(this, other);
  }

  public and(...others: AnyNodeOrAttribute[]): AndNode<AnyNodeOrAttribute[]> {
    const andNode: typeof AndNode = node('and');

    return new andNode([this, ...others]);
  }
}
