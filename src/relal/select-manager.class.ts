import isBlank from 'is-blank';
import { EmptyJoinException } from './exceptions/empty-join.exception';
import { RelalException } from './exceptions/relal.exception';
import { collapse, createTableAlias, grouping } from './helper/helper';
import { ExceptNode, IntersectNode, JoinNode, UnionAllNode, UnionNode } from './nodes/binary.node';
import { InnerJoinNode } from './nodes/binary/inner-join.node';
import { OuterJoinNode } from './nodes/binary/outer-join.node';
import { TableAliasNode } from './nodes/binary/table-alias.node';
import { CommentNode } from './nodes/comment.node';
import { DistinctNode } from './nodes/expressions/distinct.node';
import { ExistsNode } from './nodes/expressions/function.node';
import { SelectStatementNode } from './nodes/expressions/select-statement.node';
import { Node } from './nodes/node.class';
import { SelectCoreNode } from './nodes/select-core.node';
import { sql, SqlLiteralNode } from './nodes/sql-literal-node';
import { DistinctOnNode, GroupNode, LateralNode, OffsetNode, OnNode, OptimizerHintsNode } from './nodes/unary.node';
import { WithNode, WithRecursiveNode } from './nodes/unary/with.node';
import { NamedWindowNode } from './nodes/window.node';
import { Table } from './table.class';
import { TreeManager } from './tree-manager.class';

export class SelectManager extends TreeManager {
  public ast: SelectStatementNode;

  constructor(
    table: Table<unknown>,
  ) {
    super();

    this.ast = new SelectStatementNode();
    this.from(table);
    // todo
  }

  protected get context(): SelectCoreNode {
    return this.ast.cores[this.ast.cores.length - 1];
  }

  public skip(amount: number | null): this {
    this.ast.offset = amount !== null ? new OffsetNode(amount) : null;

    return this;
  }

  public exists(): ExistsNode {
    return new ExistsNode(this.ast);
  }

  public as(other: string): TableAliasNode<SelectStatementNode> {
    return createTableAlias(
      grouping(this.ast), // todo
      sql`${other}`,
    );
  }

  public lock(locking: unknown): unknown {
    // todo
  }

  public locked(): unknown {
    // todo
  }

  public on(...expressions: Array<Node | string>): this { // todo: likely not Node
    const lastRightHandSide = this.context.source.right[this.context.source.right.length - 1];
    lastRightHandSide.right = new OnNode(collapse(...expressions));

    return this;
  }

  // todo: this is likely not Node[]
  public group(...columns: Array<string | Node>): this {
    for (const column of columns) {
      if (typeof column === 'string') {
        this.context.groups.push(new GroupNode(sql`${column}`));
      } else {
        this.context.groups.push(new GroupNode(column));
      }
    }

    return this;
  }

  public from(table: string | SqlLiteralNode | JoinNode<SelectCoreNode | SqlLiteralNode, unknown> | Table<unknown>): this {
    if (typeof table === 'string') {
      table = sql`${table}`;
    }

    if (table instanceof JoinNode) {
      this.context.source.right.push(table);
    } else {
      this.context.source.left = table;
    }

    return this;
  }

  public join<LhsType extends SelectCoreNode | SqlLiteralNode,
    JoinType extends JoinNode<LhsType, null>,
    JoinTypeConstructor extends new(left: LhsType, right: null) => JoinType,
    >(
    relation: string | LhsType,
    method: JoinTypeConstructor = InnerJoinNode as JoinTypeConstructor,
  ): this {
    let leftHandSide: LhsType;
    if (typeof relation === 'string') {
      if (isBlank(relation)) {
        throw new EmptyJoinException();
      }
      leftHandSide = sql`${relation}` as LhsType;
    } else if (relation instanceof SqlLiteralNode) {
      if (isBlank(relation.rawSql)) {
        throw new EmptyJoinException();
      }
      leftHandSide = relation;
    } else {
      leftHandSide = relation;
    }

    // todo: unknown type here
    this.context.source.right.push(new method(leftHandSide, null));

    return this;
  }

  public outerJoin(relation: string | SqlLiteralNode | SelectCoreNode): this {
    return this.join(relation, OuterJoinNode);
  }

  public having(expression: unknown): this {
    this.context.havings.push(expression);

    return this;
  }

  public window(name: string): NamedWindowNode {
    const window = new NamedWindowNode(name);
    this.context.windows.push(window);

    return window;
  }

  public project(...projections: Array<string | Node>): this { // todo likely not Node
    this.context.projections.push(...projections.map(projection => {
      if (typeof projection === 'string') {
        return sql`${projection}`;
      } else {
        return projection;
      }
    }));

    return this;
  }

  public optimizerHints(...hints: unknown[]): this {
    if (hints.length > 0) {
      this.context.optimizerHints = new OptimizerHintsNode(hints);
    }

    return this;
  }

  public distinct(shouldBeDistinct: boolean = true): this {
    this.context.setQuantifier = shouldBeDistinct ? new DistinctNode() : null;

    return this;
  }

  public distinctOn(value: unknown | null): this {
    this.context.setQuantifier = value !== null ? new DistinctOnNode(value) : null;

    return this;
  }

  public order(...expressions: Array<string | Node>): this { // todo likely not Node
    this.context.projections.push(...expressions.map(expression => {
      if (typeof expression === 'string') {
        return sql`${expression}`;
      } else {
        return expression;
      }
    }));

    return this;
  }

  // public whereSql(engine: unknown): unknown {
  // todo
  // }

  public union(other: SelectManager): UnionNode;
  public union(operation: 'all', other: SelectManager): UnionAllNode;
  public union(operationOrOther: SelectManager | 'all', other?: SelectManager): UnionNode | UnionAllNode {
    if (operationOrOther === 'all') {
      if (other == null) {
        throw new RelalException(`SelectManager.union all requires 2 statements, only 1 was given`);
      }

      return new UnionAllNode(this.ast, other.ast);
    } else {
      return new UnionNode(this.ast, operationOrOther.ast);
    }
  }

  public intersect(other: SelectManager): IntersectNode {
    return new IntersectNode(this.ast, other.ast);
  }

  public except(other: SelectManager): ExceptNode {
    return new ExceptNode(this.ast, other.ast);
  }

  public lateral(tableName: string | null = null): LateralNode {
    return new LateralNode(tableName == null ? this.ast : this.as(tableName));
  }

  public with(type: 'recursive', ...subQueries: unknown[]): this;
  public with(...subQueries: unknown[]): this;
  public with(typeOrFirstSubQuery: 'recursive' | unknown, ...subQueries: unknown[]): this {
    this.ast.with = typeOrFirstSubQuery === 'recursive' ?
      new WithRecursiveNode(subQueries) :
      new WithNode([typeOrFirstSubQuery, ...subQueries]);

    return this;
  }

  public comment(...values: string[]): this {
    this.context.comment = new CommentNode(values);

    return this;
  }
}
