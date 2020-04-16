import isBlank from 'is-blank';
import { EmptyJoinException } from './exceptions/empty-join.exception';
import { RelalException } from './exceptions/relal.exception';
import { buildQuoted, collapse } from './helper/helper';
import { sql } from './helper/sql-template-handler.func';
import { AnyNodeOrAttribute } from './interfaces/node-types.interface';
import { InternalConstants } from './internal-constants';
import { ExceptNode, IntersectNode, JoinNode, UnionAllNode, UnionNode } from './nodes/binary.node';
import { FullOuterJoinNode } from './nodes/binary/full-outer-join.node';
import { InnerJoinNode } from './nodes/binary/inner-join.node';
import { OuterJoinNode } from './nodes/binary/outer-join.node';
import { CommentNode } from './nodes/comment.node';
import { DistinctNode } from './nodes/expressions/distinct.node';
import { ExistsNode } from './nodes/expressions/function.node';
import { SelectStatementNode } from './nodes/expressions/select-statement.node';
import { Node } from './nodes/node.class';
import { node } from './nodes/nodes.register';
import { SelectCoreNode } from './nodes/select-core.node';
import { SqlLiteralNode } from './nodes/sql-literal.node';
import { DistinctOnNode, GroupNode, LateralNode, LimitNode, OffsetNode, OnNode, OptimizerHintsNode } from './nodes/unary.node';
import { OrderingNode } from './nodes/unary/ordering.node';
import { WithNode, WithRecursiveNode } from './nodes/unary/with.node';
import { NamedWindowNode } from './nodes/window.node';
import { TableWithAlias } from './table-with-alias.class';
import { Table } from './table.class';
import { TreeManager } from './tree-manager.class';

export class SelectManager<Schema> extends TreeManager {
  public ast: SelectStatementNode;

  constructor(
    table: Table<Schema> | TableWithAlias<Schema>,
  ) {
    super();

    const selectStatementNode: typeof SelectStatementNode = node('select-statement');
    this.ast = new selectStatementNode();
    this.from(table);
    // todo
  }

  protected get context(): SelectCoreNode {
    return this.ast.cores[this.ast.cores.length - 1];
  }

  public offset(limit: number): this {
    const offsetNode: typeof OffsetNode = node('offset');
    this.ast.offset = new offsetNode(buildQuoted(limit));

    return this;
  }

  public skip(amount: number | null): this {
    const offsetNode: typeof OffsetNode = node('offset');
    this.ast.offset = amount !== null ? new offsetNode(buildQuoted(amount)) : null;

    return this;
  }

  public exists(): ExistsNode<SelectStatementNode> {
    const existsNode: typeof ExistsNode = node('exists');

    return new existsNode(this.ast);
  }

  public as(other: string): SelectManager<Schema> {
    if (this.context.source.left == null) {
      throw new RelalException(`Cannot set alias for non-existing source table.`);
    }

    return new SelectManager(new InternalConstants.tableWithAliasClass(other, this.context.source.left));
  }

  // public lock(locking: unknown): unknown {
  // todo
  // }

  // public locked(): unknown {
  // todo
  // }

  public on(...expressions: Array<Node | string>): this { // todo: likely not Node
    const lastRightHandSide = this.context.source.right[this.context.source.right.length - 1];
    const onNode: typeof OnNode = node('on');
    lastRightHandSide.right = new onNode(collapse(...expressions));

    return this;
  }

  // todo: this is likely not Node[]
  public group(...columns: Array<string | Node>): this {
    const groupNode: typeof GroupNode = node('group');
    for (const column of columns) {
      if (typeof column === 'string') {
        this.context.groups.push(new groupNode(sql`${column}`));
      } else {
        this.context.groups.push(new groupNode(column));
      }
    }

    return this;
  }

  public from(
    table: string | JoinNode<SelectCoreNode | SqlLiteralNode, OnNode<Node>> | Table<unknown> | TableWithAlias<unknown>,
  ): this {
    const joinNode: typeof JoinNode = node('join');
    if (table instanceof joinNode) {
      this.context.source.right.push(table);
    } else {
      if (typeof table === 'string') {
        table = new InternalConstants.tableClass(table);
      }
      this.context.source.left = table;
    }

    return this;
  }

  public join<LhsType extends SelectCoreNode | SqlLiteralNode>(
    relation: string | LhsType,
    method: typeof InnerJoinNode | typeof OuterJoinNode | typeof FullOuterJoinNode = node('inner-join') as typeof InnerJoinNode,
  ): this {
    const sqlLiteralNode: typeof SqlLiteralNode = node('sql-literal');
    let leftHandSide: LhsType;
    if (typeof relation === 'string') {
      if (isBlank(relation)) {
        throw new EmptyJoinException();
      }
      leftHandSide = sql`${relation}` as LhsType;
    } else if (relation instanceof sqlLiteralNode) {
      // todo
      // if (isBlank(relation.rawSql)) {
      //   throw new EmptyJoinException();
      // }
      leftHandSide = relation;
    } else {
      leftHandSide = relation;
    }

    // todo: unknown type here
    this.context.source.right.push(new method(leftHandSide, null));

    return this;
  }

  public outerJoin(relation: string | SqlLiteralNode | SelectCoreNode): this {
    return this.join(relation, node('outer-join'));
  }

  public having(expression: Node): this {
    this.context.havings.push(expression);

    return this;
  }

  public window(name: string): NamedWindowNode {
    const namedWindowNode: typeof NamedWindowNode = node('named-window');
    const window = new namedWindowNode(name);
    this.context.windows.push(window);

    return window;
  }

  public project(...projections: Array<string | AnyNodeOrAttribute>): this {
    this.context.projections.push(...projections.map(projection => {
      if (typeof projection === 'string') {
        return sql`${projection}`;
      } else {
        return projection;
      }
    }));

    return this;
  }

  public optimizerHints(...hints: string[]): this {
    const optimizerHintsNode: typeof OptimizerHintsNode = node('optimizer-hints');
    if (hints.length > 0) {
      this.context.optimizerHints = new optimizerHintsNode(hints);
    }

    return this;
  }

  public distinct(shouldBeDistinct: boolean = true): this {
    const distinctNode: typeof DistinctNode = node('distinct');
    this.context.setQuantifier = shouldBeDistinct ? new distinctNode() : null;

    return this;
  }

  public distinctOn(value: unknown | null): this {
    const distinctOnNode: typeof DistinctOnNode = node('distinct-on');
    this.context.setQuantifier = value !== null ? new distinctOnNode(value) : null;

    return this;
  }

  public order(...expressions: Array<string | OrderingNode<AnyNodeOrAttribute>>): this {
    this.ast.orders.push(...expressions.map(expression => {
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

  public union<OtherSchema>(other: SelectManager<OtherSchema>): UnionNode;
  public union<OtherSchema>(operation: 'all', other: SelectManager<OtherSchema>): UnionAllNode;
  public union<OtherSchema>(operationOrOther: SelectManager<OtherSchema> | 'all', other?: SelectManager<OtherSchema>): UnionNode | UnionAllNode {
    if (operationOrOther === 'all') {
      if (other == null) {
        throw new RelalException(`SelectManager.union all requires 2 statements, only 1 was given`);
      }
      const unionAllNode: typeof UnionAllNode = node('union-all');

      return new unionAllNode(this.ast, other.ast);
    } else {
      const unionNode: typeof UnionNode = node('union');

      return new unionNode(this.ast, operationOrOther.ast);
    }
  }

  public intersect<OtherSchema>(other: SelectManager<OtherSchema>): IntersectNode {
    const intersectNode: typeof IntersectNode = node('intersect');

    return new intersectNode(this.ast, other.ast);
  }

  public except<OtherSchema>(other: SelectManager<OtherSchema>): ExceptNode {
    const exceptNode: typeof ExceptNode = node('except');

    return new exceptNode(this.ast, other.ast);
  }

  public lateral(tableName: string | null = null): LateralNode {
    const lateralNode: typeof LateralNode = node('lateral');

    return new lateralNode(tableName == null ? this.ast : this.as(tableName));
  }

  public with(type: 'recursive', ...subQueries: Node[]): this;
  public with(...subQueries: Node[]): this;
  public with(typeOrFirstSubQuery: 'recursive' | Node, ...subQueries: Node[]): this {
    const withNode: typeof WithNode = node('with');
    const withRecursiveNode: typeof WithRecursiveNode = node('with-recursive');

    this.ast.with = typeOrFirstSubQuery === 'recursive' ?
      new withRecursiveNode(subQueries) :
      new withNode([typeOrFirstSubQuery, ...subQueries]);

    return this;
  }

  public comment(...values: string[]): this {
    const commentNode: typeof CommentNode = node('comment');
    this.context.comment = new commentNode(values);

    return this;
  }

  public take(limit: number): this {
    const limitNode: typeof LimitNode = node('limit');
    this.ast.offset = new limitNode(buildQuoted(limit));

    return this;
  }

  public where<Condition extends SelectManager<unknown> | Node>(expression: Condition): this {
    if (expression instanceof SelectManager) {
      this.context.wheres.push(expression.ast);
    } else {
      this.context.wheres.push(expression as Node);
    }

    return this;
  }

  public wheres(...expressions: Node[]): this {
    this.context.wheres = expressions;

    return this;
  }
}

InternalConstants.selectManagerClass = SelectManager;
