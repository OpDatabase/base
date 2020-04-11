// tslint:disable:max-classes-per-file

import { include } from '../../helper/mixin';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { AliasPredications } from '../../mixins/alias-predications.mixin';
import { Expressions } from '../../mixins/expressions.mixin';
import { MathMethods } from '../../mixins/math-methods.mixin';
import { OrderPredications } from '../../mixins/order-predications.mixin';
import { Predications } from '../../mixins/predications.mixin';
import { BinaryNode } from '../binary.node';
import { register } from '../nodes.register';

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

@register('multiplication')
export class MultiplicationNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('*', left, right);
  }
}

@register('division')
export class DivisionNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('/', left, right);
  }
}

@register('addition')
export class AdditionNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('+', left, right);
  }
}

@register('subtraction')
export class SubtractionNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('-', left, right);
  }
}

@register('concat')
export class ConcatNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('||', left, right);
  }
}

@register('bitwise-and')
export class BitwiseAndNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('&', left, right);
  }
}

@register('bitwise-or')
export class BitwiseOrNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('|', left, right);
  }
}

@register('bitwise-xor')
export class BitwiseXorNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('^', left, right);
  }
}

@register('bitwise-shift-left')
export class BitwiseShiftLeftNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('<<', left, right);
  }
}

@register('bitwise-shift-right')
export class BitwiseShiftRightNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('>>', left, right);
  }
}
