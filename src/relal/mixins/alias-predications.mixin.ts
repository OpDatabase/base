import { AliasPredicationsInterface, AnyNodeOrAttribute, AsNode, ConvertibleToString, SqlLiteralNode } from '..';

export class AliasPredications<Target extends AnyNodeOrAttribute> implements AliasPredicationsInterface<Target> {
  public as(other: ConvertibleToString): AsNode<Target, SqlLiteralNode> {
    return new AsNode(this as unknown as Target, new SqlLiteralNode(other));
  }
}
