import { Attribute } from './attributes/attribute.class';
import { DefaultTypeCaster } from './attributes/default-type-caster.class';
import { UnknownAttribute } from './attributes/unknown-attribute.class';
import { TypeCaster } from './interfaces/type-caster.interface';
import { JoinNode } from './nodes/binary.node';
import { InnerJoinNode } from './nodes/binary/inner-join.node';
import { OuterJoinNode } from './nodes/binary/outer-join.node';
import { TableAliasNode } from './nodes/binary/table-alias.node';
import { Node } from './nodes/node.class';
import { SelectCoreNode } from './nodes/select-core.node';
import { sql, SqlLiteralNode } from './nodes/sql-literal-node';
import { SelectManager } from './select-manager.class';

export class Table<Schema> {
  constructor(
    public readonly name: string,
    private readonly typeCaster: TypeCaster = new DefaultTypeCaster(),
  ) {
  }

  public alias(name: string = `${this.name}_2`): TableAliasNode<Table<Schema>> {
    return new TableAliasNode(this, sql`${name}`);
  }

  public from(): SelectManager {
    return new SelectManager(this);
  }

  public join<LhsType extends SelectCoreNode | SqlLiteralNode,
    JoinType extends JoinNode<LhsType, null>,
    JoinTypeConstructor extends new(left: LhsType, right: null) => JoinType,
    >(
    relation: string | LhsType,
    method: JoinTypeConstructor = InnerJoinNode as JoinTypeConstructor,
  ): SelectManager {
    return this.from().join(relation, method);
  }

  public outerJoin(relation: string | SqlLiteralNode | SelectCoreNode): SelectManager {
    return this.join(relation, OuterJoinNode);
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
    // todo
    return new UnknownAttribute();
  }

}
