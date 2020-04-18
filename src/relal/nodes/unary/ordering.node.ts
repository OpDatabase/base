// tslint:disable:max-classes-per-file

import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

export abstract class OrderingNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
  public nullsFirst(): NullsFirstNode<Type, this> {
    return new NullsFirstNode(this);
  }

  public nullsLast(): NullsLastNode<Type, this> {
    return new NullsLastNode(this);
  }
}

@register('nulls-first')
export class NullsFirstNode<InnerType extends AnyNodeOrAttribute, Type extends OrderingNode<InnerType>> extends UnaryNode<Type> {
  // todo: register for postgres type
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // Typescript will throw error otherwise
    // tslint:disable-next-line:no-unused-expression
    collector;
    console.warn('Your database does not accept the ordering statement "NULLS FIRST". It has therefore been ignored.');
    visitChild(this.expression);
  }
}

@register('nulls-last')
export class NullsLastNode<InnerType extends AnyNodeOrAttribute, Type extends OrderingNode<InnerType>> extends UnaryNode<Type> {
  // todo: register for postgres type
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // Typescript will throw error otherwise
    // tslint:disable-next-line:no-unused-expression
    collector;
    console.warn('Your database does not accept the ordering statement "NULLS LAST". It has therefore been ignored.');
    visitChild(this.expression);
  }
}

@register('ascending')
export class AscendingNode<Type extends AnyNodeOrAttribute> extends OrderingNode<Type> {
  public reverse(): DescendingNode<Type> {
    return new DescendingNode(this.expression);
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.expression);
    collector.add(' ASC');
  }
}

@register('descending')
export class DescendingNode<Type extends AnyNodeOrAttribute> extends OrderingNode<Type> {
  public reverse(): AscendingNode<Type> {
    return new AscendingNode(this.expression);
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.expression);
    collector.add(' DESC');
  }
}
