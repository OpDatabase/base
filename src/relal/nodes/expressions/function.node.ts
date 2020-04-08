// tslint:disable:max-classes-per-file
import { ExpressionsNode } from '../expressions.node';

export class FunctionNode extends ExpressionsNode {
  public distinct: boolean = false;

  // todo: WindowPredications
  constructor(
    public readonly expression: unknown, // todo: SelectStatementNode
    public alias?: unknown,
  ) {
    super();
  }

  public as(alias: unknown): FunctionNode {
    this.alias = alias;

    return this;
  }
}

// Function node types
export class SumNode extends FunctionNode {
}

export class ExistsNode extends FunctionNode {
}

export class MaxNode extends FunctionNode {
}

export class MinNode extends FunctionNode {
}

export class AvgNode extends FunctionNode {
}
