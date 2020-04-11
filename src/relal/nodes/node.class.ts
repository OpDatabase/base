import { AndNode, AnyNodeOrAttribute, NotNode, OrNode } from '..';

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
