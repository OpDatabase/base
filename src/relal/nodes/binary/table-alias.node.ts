import { Attribute } from '../../attributes/attribute.class';
import { UnknownAttribute } from '../../attributes/unknown-attribute.class';
import { sql } from '../../helper/sql-template-handler.func';
import { InternalConstants } from '../../internal-constants';
import { Table } from '../../table.class';
import { BinaryNode } from '../binary.node';
import { SelectStatementNode } from '../expressions/select-statement.node';
import { register } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal-node';

// left: relation, right: name
@register('table-alias')
export class TableAliasNode<InternalType extends Table<unknown> | SelectStatementNode> extends BinaryNode<InternalType, SqlLiteralNode> {
  public get relation(): InternalType {
    return this.left;
  }

  public get name(): SqlLiteralNode {
    return this.right;
  }

  public get tableName(): SqlLiteralNode {
    if (this.relation instanceof InternalConstants.tableClass) {
      return sql`${this.relation.name}`;
    }

    return this.name;
  }

  // keyof Schema
  public attribute(name: string): Attribute {
    return new UnknownAttribute(this, name);
  }
}
