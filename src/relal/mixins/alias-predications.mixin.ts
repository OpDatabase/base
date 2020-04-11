import { AliasPredications as AliasPredicationsInterface } from '../interfaces/alias-predications.interface';
import { AnyNodeOrAttribute, ConvertibleToString } from '../interfaces/node-types.interface';
import { AsNode } from '../nodes/binary.node';
import { SqlLiteralNode } from '../nodes/sql-literal-node';

export class AliasPredications<Target extends AnyNodeOrAttribute> implements AliasPredicationsInterface<Target> {
  public as(other: ConvertibleToString): AsNode<Target, SqlLiteralNode> {
    return new AsNode(this as unknown as Target, new SqlLiteralNode(other));
  }
}
