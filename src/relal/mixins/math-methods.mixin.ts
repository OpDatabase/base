import { Attribute } from '../attributes/attribute.class';
import { castOrQuote } from '../helper/helper';
import { MathMethodsInterface as MathMethodsInterface } from '../interfaces/math-methods.interface';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import {
  AdditionNode,
  BitwiseAndNode,
  BitwiseOrNode,
  BitwiseShiftLeftNode,
  BitwiseShiftRightNode,
  BitwiseXorNode,
  DivisionNode,
  MultiplicationNode,
  SubtractionNode,
} from '../nodes/binary/infix-operation.node';
import { CastedNode } from '../nodes/expressions/casted.node';
import { node } from '../nodes/nodes.register';
import { GroupingNode } from '../nodes/unary/grouping.node';
import { QuotedNode } from '../nodes/unary/quoted.node';
import { BitwiseNotNode } from '../nodes/unary/unary-operation.node';

export class MathMethods<Target extends AnyNodeOrAttribute> implements MathMethodsInterface<Target> {
  public bitwiseAnd<OtherType extends AnyNodeOrAttribute>(other: OtherType | number): GroupingNode<BitwiseAndNode<Target, OtherType>> {
    const groupingNode: typeof GroupingNode = node('grouping');
    const bitwiseAndNode: typeof BitwiseAndNode = node('bitwise-and');

    return new groupingNode(new bitwiseAndNode(this as unknown as Target, bindParameter(other, this) as OtherType));
  }

  public bitwiseNot(): BitwiseNotNode<Target> {
    const bitwiseNotNode: typeof BitwiseNotNode = node('bitwise-not');

    return new bitwiseNotNode(this as unknown as Target);
  }

  public bitwiseOr<OtherType extends AnyNodeOrAttribute>(other: OtherType | number): GroupingNode<BitwiseOrNode<Target, OtherType>> {
    const groupingNode: typeof GroupingNode = node('grouping');
    const bitwiseOrNode: typeof BitwiseOrNode = node('bitwise-or');

    return new groupingNode(new bitwiseOrNode(this as unknown as Target, bindParameter(other, this) as OtherType));
  }

  public bitwiseShiftLeft<OtherType extends AnyNodeOrAttribute>(other: OtherType | number): GroupingNode<BitwiseShiftLeftNode<Target, OtherType>> {
    const groupingNode: typeof GroupingNode = node('grouping');
    const bitwiseShiftLeftNode: typeof BitwiseShiftLeftNode = node('bitwise-shift-left');

    return new groupingNode(new bitwiseShiftLeftNode(this as unknown as Target, bindParameter(other, this) as OtherType));
  }

  public bitwiseShiftRight<OtherType extends AnyNodeOrAttribute>(other: OtherType | number): GroupingNode<BitwiseShiftRightNode<Target, OtherType>> {
    const groupingNode: typeof GroupingNode = node('grouping');
    const bitwiseShiftRightNode: typeof BitwiseShiftRightNode = node('bitwise-shift-right');

    return new groupingNode(new bitwiseShiftRightNode(this as unknown as Target, bindParameter(other, this) as OtherType));
  }

  public bitwiseXor<OtherType extends AnyNodeOrAttribute>(other: OtherType | number): GroupingNode<BitwiseXorNode<Target, OtherType>> {
    const groupingNode: typeof GroupingNode = node('grouping');
    const bitwiseXorNode: typeof BitwiseXorNode = node('bitwise-xor');

    return new groupingNode(new bitwiseXorNode(this as unknown as Target, bindParameter(other, this) as OtherType));
  }

  public divide<OtherType extends AnyNodeOrAttribute>(other: OtherType | number): DivisionNode<Target, OtherType> {
    const divisionNode: typeof DivisionNode = node('division');

    return new divisionNode(this as unknown as Target, bindParameter(other, this) as OtherType);
  }

  public minus<OtherType extends AnyNodeOrAttribute>(other: OtherType | number): GroupingNode<SubtractionNode<Target, OtherType>> {
    const groupingNode: typeof GroupingNode = node('grouping');
    const subtractionNode: typeof SubtractionNode = node('subtraction');

    return new groupingNode(new subtractionNode(this as unknown as Target, bindParameter(other, this) as OtherType));
  }

  public multiply<OtherType extends AnyNodeOrAttribute>(other: OtherType | number): MultiplicationNode<Target, OtherType> {
    const multiplicationNode: typeof MultiplicationNode = node('multiplication');

    return new multiplicationNode(this as unknown as Target, bindParameter(other, this) as OtherType);
  }

  public plus<OtherType extends AnyNodeOrAttribute>(other: OtherType | number): GroupingNode<AdditionNode<Target, OtherType>> {
    const groupingNode: typeof GroupingNode = node('grouping');
    const additionNode: typeof AdditionNode = node('addition');

    return new groupingNode(new additionNode(this as unknown as Target, bindParameter(other, this) as OtherType));
  }
}

function bindParameter(input: AnyNodeOrAttribute | number, target: unknown): AnyNodeOrAttribute | QuotedNode<number> | CastedNode<number> {
  if (typeof input === 'number') {
    return castOrQuote(input, target as Attribute);
  } else {
    return input;
  }
}
