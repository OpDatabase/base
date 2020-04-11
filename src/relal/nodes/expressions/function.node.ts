// tslint:disable:max-classes-per-file
import { AnyNodeOrAttribute, ConvertibleToString, ExpressionsNode } from '../..';

export class FunctionNode<Type extends AnyNodeOrAttribute> extends ExpressionsNode {
  public readonly distinct: boolean = false;

  // todo: WindowPredications
  constructor(
    public readonly expression: Type, // todo: SelectStatementNode
    public alias?: ConvertibleToString,
  ) {
    super();
  }

  // todo: as (type mismatch)
  public as2(alias: ConvertibleToString): this {
    this.alias = alias;

    return this;
  }
}

// Function node types
export class SumNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

// todo
export class ExistsNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

export class MaxNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

export class MinNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

export class AvgNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}
