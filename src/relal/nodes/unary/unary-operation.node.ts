// tslint:disable:max-classes-per-file

import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

export abstract class UnaryOperationNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
  protected constructor(
    public readonly operator: string,
    operand: Type,
  ) {
    super(operand);
  }
}

@register('bitwise-not')
export class BitwiseNotNode<Type extends AnyNodeOrAttribute> extends UnaryOperationNode<Type> {
  constructor(operand: Type) {
    super('~', operand);
  }
}
