import { Attribute } from '../../attributes/attribute.class';
import { UnknownAttribute } from '../../attributes/unknown-attribute.class';
import { Table } from '../../table.class';
import { BinaryNode } from '../binary.node';
import { SelectStatementNode } from '../expressions/select-statement.node';
import { sql, SqlLiteralNode } from '../sql-literal-node';

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
