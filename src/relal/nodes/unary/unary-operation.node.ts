// tslint:disable:max-classes-per-file

import { AnyNodeOrAttribute, UnaryNode } from '../..';

export abstract class UnaryOperationNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
  protected constructor(
    public readonly operator: string,
    operand: Type,
  ) {
    super(operand);
  }
}

export class BitwiseNotNode<Type extends AnyNodeOrAttribute> extends UnaryOperationNode<Type> {
  constructor(operand: Type) {
    super('~', operand);
  }
}
