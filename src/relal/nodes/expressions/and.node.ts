import { ExpressionsNode } from '../expressions.node';

export class AndNode<LhsType, RhsType> extends ExpressionsNode {
  constructor(
    public readonly children: [LhsType, RhsType],
  ) {
    super();
  }

  public get left(): LhsType {
    return this.children[0];
  }

  public get right(): RhsType { // todo: this migth be an array (?)
    return this.children[1];
  }
}
