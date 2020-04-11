import { ExpressionsInterface as ExpressionsInterface } from '../interfaces/expressions.interface';
import { AnyNodeOrAttribute, ConvertibleToString } from '../interfaces/node-types.interface';
import { AvgNode, MaxNode, MinNode, SumNode } from '../nodes/expressions/function.node';
import { CountNode } from '../nodes/expressions/function/count.node';
import { node } from '../nodes/nodes.register';
import { ExtractNode } from '../nodes/unary/extract.node';

export class Expressions<Target extends AnyNodeOrAttribute> implements ExpressionsInterface<Target> {
  public average(): AvgNode<Target> {
    const avgNode: typeof AvgNode = node('avg');

    return new avgNode(this as unknown as Target);
  }

  public count(distinct: boolean = false): CountNode<Target> {
    const countNode: typeof CountNode = node('count');

    return new countNode(this as unknown as Target, distinct);
  }

  public extract(field: ConvertibleToString): ExtractNode<Target> {
    const extractNode: typeof ExtractNode = node('extract');

    return new extractNode(this as unknown as Target, field);
  }

  public maximum(): MaxNode<Target> {
    const maxNode: typeof MaxNode = node('max');

    return new maxNode(this as unknown as Target);
  }

  public minimum(): MinNode<Target> {
    const minNode: typeof MinNode = node('min');

    return new minNode(this as unknown as Target);
  }

  public sum(): SumNode<Target> {
    const sumNode: typeof SumNode = node('sum');

    return new sumNode(this as unknown as Target);
  }
}
