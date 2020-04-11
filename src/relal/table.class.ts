import { Attribute } from './attributes/attribute.class';
import { UnknownAttribute } from './attributes/unknown-attribute.class';
import { sql } from './helper/sql-template-handler.func';
import { InternalConstants } from './internal-constants';
import { JoinNode } from './nodes/binary.node';
import { TableAliasNode } from './nodes/binary/table-alias.node';
import { Node } from './nodes/node.class';
import { node } from './nodes/nodes.register';
import { SelectCoreNode } from './nodes/select-core.node';
import { SqlLiteralNode } from './nodes/sql-literal-node';
import { SelectManager } from './select-manager.class';

export class Table<Schema> {
  constructor(
    public readonly name: string,
    // private readonly typeCaster: TypeCasterInterface = new DefaultTypeCaster(),
  ) {
  }

  public alias(name: string = `${this.name}_2`): TableAliasNode<Table<Schema>> {
    const tableAliasNode: typeof TableAliasNode = node('table-alias');

    return new tableAliasNode(this, sql`${name}`);
  }

  public from(): SelectManager {
    return new SelectManager(this);
  }

  public join<LhsType extends SelectCoreNode | SqlLiteralNode,
    JoinType extends JoinNode<LhsType, null>,
    JoinTypeConstructor extends new(left: LhsType, right: null) => JoinType,
    >(
    relation: string | LhsType,
    method: JoinTypeConstructor = node('inner-join') as JoinTypeConstructor,
  ): SelectManager {
    return this.from().join(relation, method);
  }

  public outerJoin(relation: string | SqlLiteralNode | SelectCoreNode): SelectManager {
    return this.join(relation, node('outer-join'));
  }

  public group(...columns: Array<string | Node>): SelectManager {
    return this.from().group(...columns);
  }

  public order(...expressions: Array<string | Node>): SelectManager {
    return this.from().order(...expressions);
  }

  public where(condition: unknown): unknown {
    return this.from().where(condition);
  }

  public project(...things: Array<string | Node>): SelectManager {
    return this.from().project(...things);
  }

  public take(amount: number): unknown {
    return this.from().take(amount);
  }

  public skip(amount: number): unknown {
    return this.from().skip(amount);
  }

  public having(expression: unknown): SelectManager {
    return this.from().having(expression);
  }

  // todo keyof Schema
  public attribute(name: string): Attribute {
    console.log(name);

    // todo
    return new UnknownAttribute();
  }
}

InternalConstants.tableClass = Table;
