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
import { GroupingNode } from '../nodes/unary/grouping.node';
import { BitwiseNotNode } from '../nodes/unary/unary-operation.node';
import { AnyNodeOrAttribute } from './node-types.interface';

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
