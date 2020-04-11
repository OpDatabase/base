import { AscendingNode, DescendingNode } from '../nodes/unary/ordering.node';
import { AnyNodeOrAttribute } from './node-types.interface';

export interface OrderPredicationsInterface<BaseType extends AnyNodeOrAttribute> {
  asc(): AscendingNode<BaseType>;

  desc(): DescendingNode<BaseType>;
}
