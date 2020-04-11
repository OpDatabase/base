import { Node } from './node.class';
import { register } from './nodes.register';

@register('comment')
export class CommentNode extends Node {
  constructor(
    public readonly comments: string[],
  ) {
    super();
  }
}
