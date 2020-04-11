// tslint:disable:max-classes-per-file
import { AnyNodeOrAttribute, ConvertibleToString } from '../../interfaces/node-types.interface';
import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';

export abstract class FunctionNode<Type extends AnyNodeOrAttribute> extends ExpressionsNode {
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
@register('sum')
export class SumNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

// todo
@register('exists')
export class ExistsNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

@register('max')
export class MaxNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

@register('min')
export class MinNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}

@register('avg')
export class AvgNode<Type extends AnyNodeOrAttribute> extends FunctionNode<Type> {
}
