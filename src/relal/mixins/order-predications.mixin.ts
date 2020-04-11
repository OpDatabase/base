import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { OrderPredications as OrderPredicationsInterface } from '../interfaces/order-predications.interface';
import { AscendingNode, DescendingNode } from '../nodes/unary/ordering.node';

export class OrderPredications<Target extends AnyNodeOrAttribute> implements OrderPredicationsInterface<Target> {
  public asc(): AscendingNode<Target> {
    return new AscendingNode(this as unknown as Target);
  }

  public desc(): DescendingNode<Target> {
    return new DescendingNode(this as unknown as Target);
  }
}
