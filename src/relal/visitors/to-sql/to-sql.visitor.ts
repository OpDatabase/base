import { Visitor } from '../visitor.class';

export abstract class ToSqlVisitor extends Visitor {
  // todo: link to connection

  public compile(node: unknown, collector: unknown): unknown {
    // todo
  }
}
