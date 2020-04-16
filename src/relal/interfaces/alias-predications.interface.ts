import { AsNode } from '../nodes/binary.node';
import { SqlLiteralNode } from '../nodes/sql-literal.node';
import { AnyNodeOrAttribute, ConvertibleToString } from './node-types.interface';

export interface AliasPredicationsInterface<BaseType extends AnyNodeOrAttribute> {
  as(other: ConvertibleToString): AsNode<BaseType, SqlLiteralNode>;
}
