import { buildQuoted } from './helper/helper';
import { StatementMethods } from './interfaces/statement-methods.interface';
import { SelectStatementNode } from './nodes/expressions/select-statement.node';
import { SelectCoreNode } from './nodes/select-core.node';
import { LimitNode, OffsetNode } from './nodes/unary.node';
import { QuotedNode } from './nodes/unary/quoted.node';

export abstract class TreeManager implements StatementMethods {
  public ast: SelectStatementNode | undefined; // todo: remove bang operators in class

  protected get context(): SelectCoreNode | undefined {
    return this.ast?.cores[this.ast.cores.length - 1];
  }

  public getKey(): unknown {
    return undefined;
  }

  public offset(limit: number): this {
    this.ast!.offset = new OffsetNode(buildQuoted(limit) as QuotedNode<number>); // todo explicit type casting

    return this;
  }

  // todo: type
  public order(...expressions: unknown[]): this {
    this.ast!.orders = expressions;

    return this;
  }

  public setKey(): this {
    return this;
  }

  public take(limit: number): this {
    this.ast!.offset = new LimitNode(buildQuoted(limit) as QuotedNode<number>); // todo explicit type casting

    return this;
  }

  public where(expression: TreeManager | unknown): this {
    if (expression instanceof TreeManager) {
      expression = expression.ast;
    }
    this.context!.wheres.push(expression);

    return this;
  }

  public wheres(...expressions: unknown[]): this {
    this.context!.wheres = expressions;

    return this;
  }

  /* todo public toSql(engine: unknown): unknown {

  } */
}
