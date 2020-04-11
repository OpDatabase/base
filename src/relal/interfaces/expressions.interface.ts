import { AnyNodeOrAttribute, AvgNode, ConvertibleToString, CountNode, ExtractNode, MaxNode, MinNode, SumNode } from '..';

export interface ExpressionsInterface<BaseType extends AnyNodeOrAttribute> {
  count(distinct?: boolean): CountNode<BaseType>;

  sum(): SumNode<BaseType>;

  maximum(): MaxNode<BaseType>;

  minimum(): MinNode<BaseType>;

  average(): AvgNode<BaseType>;

  extract(field: ConvertibleToString): ExtractNode<BaseType>;
}
