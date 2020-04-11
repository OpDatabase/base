import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { OrNode } from './binary.node';
import { AndNode } from './expressions/and.node';
import { NotNode } from './unary.node';

export abstract class Node {
  public fetchAttribute(): void {
    // Intentionally blank
  }

  public not(): NotNode<this> {
    return new NotNode(this);
  }

  public or<OtherType extends AnyNodeOrAttribute>(other: OtherType): OrNode<this, OtherType> {
    return new OrNode(this, other);
  }

  public and(...others: AnyNodeOrAttribute[]): AndNode<AnyNodeOrAttribute[]> {
    return new AndNode([this, ...others]);
  }
}
