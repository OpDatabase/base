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
  MultiplicationNode,
  SubtractionNode,
} from '..';

export interface MathMethodsInterface<BaseType extends AnyNodeOrAttribute> {
  multiply<OtherType extends AnyNodeOrAttribute>(other: OtherType): MultiplicationNode<BaseType, OtherType>;

  plus<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<AdditionNode<BaseType, OtherType>>;

  minus<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<SubtractionNode<BaseType, OtherType>>;

  divide<OtherType extends AnyNodeOrAttribute>(other: OtherType): DivisionNode<BaseType, OtherType>;

  bitwiseAnd<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseAndNode<BaseType, OtherType>>;

  bitwiseOr<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseOrNode<BaseType, OtherType>>;

  bitwiseXor<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseXorNode<BaseType, OtherType>>;

  bitwiseShiftLeft<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseShiftLeftNode<BaseType, OtherType>>;

  bitwiseShiftRight<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseShiftRightNode<BaseType, OtherType>>;

  bitwiseNot(): BitwiseNotNode<BaseType>;
}
