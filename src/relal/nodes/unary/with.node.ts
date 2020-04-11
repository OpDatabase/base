import { UnaryNode } from '../..';

export class WithNode extends UnaryNode<unknown> { // todo
  public get children(): unknown {
    return this.value;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class WithRecursiveNode extends WithNode {
}
