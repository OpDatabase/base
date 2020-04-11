import { AnyNodeOrAttribute, AsNode, ConvertibleToString, SqlLiteralNode } from '..';

export interface AliasPredicationsInterface<BaseType extends AnyNodeOrAttribute> {
  as(other: ConvertibleToString): AsNode<BaseType, SqlLiteralNode>;
}
