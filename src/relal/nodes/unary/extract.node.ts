import { AnyNodeOrAttribute, ConvertibleToString } from '../../interfaces/node-types.interface';
import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

@register('extract')
export class ExtractNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
  constructor(
    expression: Type,
    public readonly field: ConvertibleToString,
  ) {
    super(expression);
  }
}
