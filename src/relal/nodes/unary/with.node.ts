import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

@register('with')
export class WithNode extends UnaryNode<unknown> { // todo
  public get children(): unknown {
    return this.value;
  }
}

// tslint:disable-next-line:max-classes-per-file
@register('with-recursive')
export class WithRecursiveNode extends WithNode {
}
