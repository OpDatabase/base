import {
  AdditionNode,
  AnyNodeOrAttribute,
  BitwiseAndNode,
  BitwiseNotNode,
  BitwiseOrNode,
  BitwiseShiftLeftNode,
  BitwiseShiftRightNode,
  BitwiseXorNode,
  DivisionNode,
  GroupingNode,
  MathMethodsInterface,
  MultiplicationNode,
  SubtractionNode,
} from '..';

export class MathMethods<Target extends AnyNodeOrAttribute> implements MathMethodsInterface<Target> {
  public bitwiseAnd<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseAndNode<Target, OtherType>> {
    return new GroupingNode(new BitwiseAndNode(this as unknown as Target, other));
  }

  public bitwiseNot(): BitwiseNotNode<Target> {
    return new BitwiseNotNode(this as unknown as Target);
  }

  public bitwiseOr<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseOrNode<Target, OtherType>> {
    return new GroupingNode(new BitwiseOrNode(this as unknown as Target, other));
  }

  public bitwiseShiftLeft<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseShiftLeftNode<Target, OtherType>> {
    return new GroupingNode(new BitwiseShiftLeftNode(this as unknown as Target, other));
  }

  public bitwiseShiftRight<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseShiftRightNode<Target, OtherType>> {
    return new GroupingNode(new BitwiseShiftRightNode(this as unknown as Target, other));
  }

  public bitwiseXor<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseXorNode<Target, OtherType>> {
    return new GroupingNode(new BitwiseXorNode(this as unknown as Target, other));
  }

  public divide<OtherType extends AnyNodeOrAttribute>(other: OtherType): DivisionNode<Target, OtherType> {
    return new DivisionNode(this as unknown as Target, other);
  }

  public minus<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<SubtractionNode<Target, OtherType>> {
    return new GroupingNode(new SubtractionNode(this as unknown as Target, other));
  }

  public multiply<OtherType extends AnyNodeOrAttribute>(other: OtherType): MultiplicationNode<Target, OtherType> {
    return new MultiplicationNode(this as unknown as Target, other);
  }

  public plus<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<AdditionNode<Target, OtherType>> {
    return new GroupingNode(new AdditionNode(this as unknown as Target, other));
  }
}
