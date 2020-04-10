import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { ExpressionsNode } from '../expressions.node';

export class AndNode<ChildTypes extends AnyNodeOrAttribute[]> extends ExpressionsNode {
  constructor(
    public readonly children: ChildTypes,
  ) {
    super();
  }

  /*
  public get left(): ChildTypes[0] {
    return this.children[0];
  }

  public get right(): ChildTypes[1] { // todo: this migth be an array (?)
    return this.children[1];
  } */
}
