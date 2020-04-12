import { Collector } from '../../collectors/collector.class';
import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { Node } from '../node.class';
import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

@register('with')
export class WithNode extends UnaryNode<Node[]> { // todo
  public get children(): Node[] {
    return this.value;
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // todo
    collector.add('WITH ');
    this.visitEach(this.children, ', ', collector, visitChild);
  }
}

// tslint:disable-next-line:max-classes-per-file
@register('with-recursive')
export class WithRecursiveNode extends WithNode {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // todo
    collector.add('WITH RECURSIVE ');
    this.visitEach(this.children, ', ', collector, visitChild);
  }
}
