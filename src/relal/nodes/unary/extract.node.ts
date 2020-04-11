import { AnyNodeOrAttribute, ConvertibleToString, UnaryNode } from '../..';

export class ExtractNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
  constructor(
    expression: Type,
    public readonly field: ConvertibleToString,
  ) {
    super(expression);
  }
}
