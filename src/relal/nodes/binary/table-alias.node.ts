import { Attribute } from '../../attributes/attribute.class';
import { UnknownAttribute } from '../../attributes/unknown-attribute.class';
import { FeatureNotAvailableException } from '../../exceptions/feature-not-available.exception';
import { Table } from '../../table.class';
import { BinaryNode } from '../binary.node';
import { register } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal-node';

/**
 * Renders an aliased table name like `originalTableName aliasName`.
 */
@register('table-alias')
export class TableAliasNode<InternalType extends Table<unknown> | SqlLiteralNode> extends BinaryNode<InternalType, string> {
  public get relation(): InternalType {
    return this.left;
  }

  public get name(): string {
    return this.right;
  }

  // todo: remove (?)
  public get tableName(): string {
    // todo
    // @ts-ignore
    return this.name || this.relation?.name;
  }

  // keyof Schema
  public attribute(name: string): Attribute {
    // todo
    // @ts-ignore
    return new UnknownAttribute(this, name);
  }

  public visit(): void {
    throw new FeatureNotAvailableException('Cannot collect table name using TableAliasNode. This requires database-specific implementation using a custom Visitor.');
  }
}
