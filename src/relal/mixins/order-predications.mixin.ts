import { AnyNodeOrAttribute, AscendingNode, DescendingNode, OrderPredicationsInterface } from '..';

export class OrderPredications<Target extends AnyNodeOrAttribute> implements OrderPredicationsInterface<Target> {
  public asc(): AscendingNode<Target> {
    return new AscendingNode(this as unknown as Target);
  }

  public desc(): DescendingNode<Target> {
    return new DescendingNode(this as unknown as Target);
  }
}
