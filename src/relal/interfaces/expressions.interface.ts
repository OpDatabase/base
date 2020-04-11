import { AvgNode, MaxNode, MinNode, SumNode } from '../nodes/expressions/function.node';
import { CountNode } from '../nodes/expressions/function/count.node';
import { ExtractNode } from '../nodes/unary/extract.node';
import { AnyNodeOrAttribute, ConvertibleToString } from './node-types.interface';

export interface ExpressionsInterface<BaseType extends AnyNodeOrAttribute> {
  count(distinct?: boolean): CountNode<BaseType>;

  sum(): SumNode<BaseType>;

  maximum(): MaxNode<BaseType>;

  minimum(): MinNode<BaseType>;

  average(): AvgNode<BaseType>;

  extract(field: ConvertibleToString): ExtractNode<BaseType>;
}
