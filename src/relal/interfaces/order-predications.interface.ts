import { AnyNodeOrAttribute, AscendingNode, DescendingNode } from '..';

export interface OrderPredicationsInterface<BaseType extends AnyNodeOrAttribute> {
  asc(): AscendingNode<BaseType>;

  desc(): DescendingNode<BaseType>;
}
