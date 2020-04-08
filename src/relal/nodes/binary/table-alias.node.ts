import { Attribute } from '../../attributes/attribute.class';
import { Table } from '../../table.class';
import { BinaryNode } from '../binary.node';
import { SelectStatementNode } from '../expressions/select-statement.node';
import { rawSql, SqlLiteralNode } from '../sql-literal-node';

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
      return rawSql`${this.relation.name}`;
    }

    return this.name;
  }

  // keyof Schema
  public attribute(name: unknown): Attribute {
    // todo
  }
}
