import { AnyNodeOrAttribute, AvgNode, ConvertibleToString, CountNode, ExpressionsInterface, ExtractNode, MaxNode, MinNode, SumNode } from '..';

export class Expressions<Target extends AnyNodeOrAttribute> implements ExpressionsInterface<Target> {
  public average(): AvgNode<Target> {
    return new AvgNode(this as unknown as Target);
  }

  public count(distinct: boolean = false): CountNode<Target> {
    return new CountNode(this as unknown as Target, distinct);
  }

  public extract(field: ConvertibleToString): ExtractNode<Target> {
    return new ExtractNode(this as unknown as Target, field);
  }

  public maximum(): MaxNode<Target> {
    return new MaxNode(this as unknown as Target);
  }

  public minimum(): MinNode<Target> {
    return new MinNode(this as unknown as Target);
  }

  public sum(): SumNode<Target> {
    return new SumNode(this as unknown as Target);
  }
}
