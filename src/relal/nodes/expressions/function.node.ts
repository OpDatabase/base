// tslint:disable:max-classes-per-file
import { AnyNodeOrAttribute, ConvertibleToString } from '../../interfaces/node-types.interface';
import { ExpressionsNode } from '../expressions.node';

export class FunctionNode<Type extends AnyNodeOrAttribute> extends ExpressionsNode {
  public readonly distinct: boolean = false;

  // todo: WindowPredications
  constructor(
    public readonly expression: Type, // todo: SelectStatementNode
    public alias?: ConvertibleToString,
  ) {
    super();
  }

  public as(alias: ConvertibleToString): this {
    this.alias = alias;

    return this;
  }
}

// Function node types
export class SumNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

// todo
export class ExistsNode<Type extends AnyNodeOrAttribute> extends FunctionNode<unknown> {
}

export class MaxNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

export class MinNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

export class AvgNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}
