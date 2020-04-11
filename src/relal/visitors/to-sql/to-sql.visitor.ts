import { Visitor } from '../..';

export abstract class ToSqlVisitor extends Visitor {
  // todo: link to connection

  public compile(node: unknown, collector: unknown): void {
    console.log(node, collector);
    // todo
  }
}
