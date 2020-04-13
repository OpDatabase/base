// tslint:disable:max-classes-per-file

import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { BinaryNode } from '../binary.node';
import { register } from '../nodes.register';

/**
 * Renders a mathematical operation statement, like `fieldOrValue + fieldOrValue`
 */
// @include(AliasPredications, Expressions, MathMethods, OrderPredications, Predications)
export abstract class InfixOperationNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends BinaryNode<LhsType, RhsType> {
  protected constructor(
    public operator: string,
    left: LhsType,
    right: RhsType,
  ) {
    super(left, right);
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    collector.add(` ${this.operator} `);
    visitChild(this.right);
  }
}

// export interface InfixOperationNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
//   extends BinaryNode<LhsType, RhsType>, AliasPredications<InfixOperationNode<LhsType, RhsType>>,
//     Expressions<InfixOperationNode<LhsType, RhsType>>, MathMethods<InfixOperationNode<LhsType, RhsType>>,
//     OrderPredications<InfixOperationNode<LhsType, RhsType>>, Predications<InfixOperationNode<LhsType, RhsType>> {
// }

/**
 * Renders a multiplication operation statement, like `fieldOrValue * fieldOrValue`
 */
@register('multiplication')
export class MultiplicationNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('*', left, right);
  }
}

/**
 * Renders a division operation statement, like `fieldOrValue / fieldOrValue`
 */
@register('division')
export class DivisionNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('/', left, right);
  }
}

/**
 * Renders an addition operation statement, like `fieldOrValue + fieldOrValue`
 */
@register('addition')
export class AdditionNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('+', left, right);
  }
}

/**
 * Renders a subtraction operation statement, like `fieldOrValue - fieldOrValue`
 */
@register('subtraction')
export class SubtractionNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('-', left, right);
  }
}

/**
 * Renders a concat operation statement, like `fieldOrValue || fieldOrValue`
 */
@register('concat')
export class ConcatNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('||', left, right);
  }
}

/**
 * Renders a bitwise and operation statement, like `fieldOrValue & fieldOrValue`
 */
@register('bitwise-and')
export class BitwiseAndNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('&', left, right);
  }
}

/**
 * Renders a bitwise or operation statement, like `fieldOrValue | fieldOrValue`
 */
@register('bitwise-or')
export class BitwiseOrNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('|', left, right);
  }
}

/**
 * Renders a bitwise XOR operation statement, like `fieldOrValue ^ fieldOrValue`
 */
@register('bitwise-xor')
export class BitwiseXorNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('^', left, right);
  }
}

/**
 * Renders a bitwise shift left operation statement, like `fieldOrValue << fieldOrValue`
 */
@register('bitwise-shift-left')
export class BitwiseShiftLeftNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('<<', left, right);
  }
}

/**
 * Renders a bitwise shift right operation statement, like `fieldOrValue >> fieldOrValue`
 */
@register('bitwise-shift-right')
export class BitwiseShiftRightNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute>
  extends InfixOperationNode<LhsType, RhsType> {
  constructor(left: LhsType, right: RhsType) {
    super('>>', left, right);
  }
}
