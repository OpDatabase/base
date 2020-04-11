// tslint:disable:max-classes-per-file

import { AnyNodeOrAttribute, UnaryNode } from '../..';

export class OrderingNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
  public nullsFirst(): NullsFirstNode<Type, this> {
    return new NullsFirstNode(this);
  }

  public nullsLast(): NullsLastNode<Type, this> {
    return new NullsLastNode(this);
  }
}

export class NullsFirstNode<InnerType extends AnyNodeOrAttribute, Type extends OrderingNode<InnerType>> extends UnaryNode<Type> {
}

export class NullsLastNode<InnerType extends AnyNodeOrAttribute, Type extends OrderingNode<InnerType>> extends UnaryNode<Type> {
}

export class AscendingNode<Type extends AnyNodeOrAttribute> extends OrderingNode<Type> {
  public readonly direction: string = 'asc';
  public readonly isAscending: boolean = true;
  public readonly isDescending: boolean = false;

  public reverse(): DescendingNode<Type> {
    return new DescendingNode(this.expression);
  }
}

export class DescendingNode<Type extends AnyNodeOrAttribute> extends OrderingNode<Type> {
  public readonly direction: string = 'desc';
  public readonly isAscending: boolean = false;
  public readonly isDescending: boolean = true;

  public reverse(): AscendingNode<Type> {
    return new AscendingNode(this.expression);
  }
}
