import { buildQuoted } from './helper/helper';
import { StatementMethodsInterface } from './interfaces/statement-methods.interface';
import { SelectStatementNode } from './nodes/expressions/select-statement.node';
import { node } from './nodes/nodes.register';
import { SelectCoreNode } from './nodes/select-core.node';
import { LimitNode, OffsetNode } from './nodes/unary.node';

export abstract class TreeManager implements StatementMethodsInterface {
  public ast: SelectStatementNode | undefined; // todo: remove bang operators in class

  protected get context(): SelectCoreNode | undefined {
    return this.ast?.cores[this.ast.cores.length - 1];
  }

  public getKey(): unknown {
    return undefined;
  }

  public offset(limit: number): this {
    const offsetNode: typeof OffsetNode = node('offset');
    this.ast!.offset = new offsetNode(buildQuoted(limit));

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
    const limitNode: typeof LimitNode = node('limit');
    this.ast!.offset = new limitNode(buildQuoted(limit));

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
