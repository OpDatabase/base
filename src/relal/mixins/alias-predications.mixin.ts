import { AliasPredicationsInterface as AliasPredicationsInterface } from '../interfaces/alias-predications.interface';
import { AnyNodeOrAttribute, ConvertibleToString } from '../interfaces/node-types.interface';
import { AsNode } from '../nodes/binary.node';
import { node } from '../nodes/nodes.register';
import { SqlLiteralNode } from '../nodes/sql-literal.node';

export class AliasPredications<Target extends AnyNodeOrAttribute> implements AliasPredicationsInterface<Target> {
  public as(other: ConvertibleToString): AsNode<Target, SqlLiteralNode> {
    const asNode: typeof AsNode = node('as');
    const sqlLiteralNode: typeof SqlLiteralNode = node('sql-literal');

    return new asNode(this as unknown as Target, new sqlLiteralNode(other));
  }
}
