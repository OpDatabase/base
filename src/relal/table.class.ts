import {
  Attribute,
  InnerJoinNode,
  JoinNode,
  Node,
  OuterJoinNode,
  SelectCoreNode,
  SelectManager,
  sql,
  SqlLiteralNode,
  TableAliasNode,
  UnknownAttribute,
} from '.';

export class Table<Schema> {
  constructor(
    public readonly name: string,
    // private readonly typeCaster: TypeCasterInterface = new DefaultTypeCaster(),
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
    console.log(name);
    // todo
    return new UnknownAttribute();
  }

}
