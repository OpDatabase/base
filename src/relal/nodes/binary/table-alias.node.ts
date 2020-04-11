import { Attribute, BinaryNode, SelectStatementNode, sql, SqlLiteralNode, Table, UnknownAttribute } from '../..';

// left: relation, right: name
export class TableAliasNode<InternalType extends Table<unknown> | SelectStatementNode> extends BinaryNode<InternalType, SqlLiteralNode> {
  public get relation(): InternalType {
    return this.left;
  }

  public get name(): SqlLiteralNode {
    return this.right;
  }

  public get tableName(): SqlLiteralNode {
    if (this.relation instanceof Table) {
      return sql`${this.relation.name}`;
    }

    return this.name;
  }

  // keyof Schema
  public attribute(name: unknown): Attribute {
    console.log(name);
    // todo
    return new UnknownAttribute();
  }
}
