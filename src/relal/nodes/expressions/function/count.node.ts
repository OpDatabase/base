import { AnyNodeOrAttribute, ConvertibleToString } from '../../../interfaces/node-types.interface';
import { FunctionNode } from '../function.node';

export class CountNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
  constructor(
    expression: Type,
    public readonly distinct: boolean = false,
    alias?: ConvertibleToString,
  ) {
    super(expression, alias);
  }
}
