// tslint:disable:max-classes-per-file

import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { BinaryNode } from '../binary.node';

export abstract class InfixOperationNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends BinaryNode<LhsType, RhsType> {
  // todo: implements AliasPredications, Expressions, MathMethods, OrderPredications, Predications
  protected constructor(
    public operator: string,
    left: LhsType,
    right: RhsType,
  ) {
    super(left, right);
  }
}

export class MultiplicationNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('*', left, right);
  }
}

export class DivisionNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('/', left, right);
  }
}

export class AdditionNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('+', left, right);
  }
}

export class SubtractionNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('-', left, right);
  }
}

export class ConcatNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('||', left, right);
  }
}

export class BitwiseAndNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('&', left, right);
  }
}

export class BitwiseOrNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('|', left, right);
  }
}

export class BitwiseXorNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('^', left, right);
  }
}

export class BitwiseShiftLeftNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('<<', left, right);
  }
}

export class BitwiseShiftRightNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('>>', left, right);
  }
}
