import { AnyNodeOrAttribute, ConvertibleToString } from '../../interfaces/node-types.interface';
import { UnaryNode } from '../unary.node';

export class ExtractNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
  constructor(
    expression: Type,
    public readonly field: ConvertibleToString,
  ) {
    super(expression);
  }
}
