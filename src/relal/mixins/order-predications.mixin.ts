import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { OrderPredicationsInterface as OrderPredicationsInterface } from '../interfaces/order-predications.interface';
import { node } from '../nodes/nodes.register';
import { AscendingNode, DescendingNode } from '../nodes/unary/ordering.node';

export class OrderPredications<Target extends AnyNodeOrAttribute> implements OrderPredicationsInterface<Target> {
  public asc(): AscendingNode<Target> {
    const ascendingNode: typeof AscendingNode = node('ascending');

    return new ascendingNode(this as unknown as Target);
  }

  public desc(): DescendingNode<Target> {
    const descendingNode: typeof DescendingNode = node('descending');

    return new descendingNode(this as unknown as Target);
  }
}
