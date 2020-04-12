import { Collector } from '../collectors/collector.class';
import { Node } from './node.class';
import { register } from './nodes.register';

@register('comment')
export class CommentNode extends Node {
  constructor(
    public readonly comments: string[],
  ) {
    super();
  }

  public visit(collector: Collector<unknown>): void {
    this.comments.forEach(comment => collector.add(`/* ${collector.adapter.sanitizeSqlComment(comment)} */`));
  }
}
