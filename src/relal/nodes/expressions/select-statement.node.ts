import { ExpressionsNode } from '../expressions.node';
import { SelectCoreNode } from '../select-core.node';
import { OffsetNode } from '../unary.node';

export class SelectStatementNode extends ExpressionsNode {
  public orders: unknown[];
  public limit: unknown;
  public lock: unknown;
  public offset: OffsetNode | null = null;
  public with: unknown;

  constructor(
    public cores: SelectCoreNode[] = [new SelectCoreNode()],
  ) {
    super();
  }
}
