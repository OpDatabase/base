// tslint:disable:max-classes-per-file

import { AliasPredications, AnyNodeOrAttribute, BinaryNode, Expressions, include, MathMethods, OrderPredications, Predications } from '../..';

@include(AliasPredications, Expressions, MathMethods, OrderPredications, Predications)
export abstract class InfixOperationNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends BinaryNode<LhsType, RhsType> {
  protected constructor(
    public operator: string,
    left: LhsType,
    right: RhsType,
  ) {
    super(left, right);
  }
}

export interface InfixOperationNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends BinaryNode<LhsType, RhsType>, AliasPredications<InfixOperationNode<LhsType, RhsType>>,
    Expressions<InfixOperationNode<LhsType, RhsType>>, MathMethods<InfixOperationNode<LhsType, RhsType>>,
    OrderPredications<InfixOperationNode<LhsType, RhsType>>, Predications<InfixOperationNode<LhsType, RhsType>> {
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
