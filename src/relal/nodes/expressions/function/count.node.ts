import { AnyNodeOrAttribute, ConvertibleToString, FunctionNode } from '../../..';

export class CountNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
  constructor(
    expression: Type,
    public readonly distinct: boolean = false,
    alias?: ConvertibleToString,
  ) {
    super(expression, alias);
  }
}
