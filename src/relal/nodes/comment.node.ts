import { Node } from './node.class';

export class CommentNode extends Node {
  constructor(
    public readonly comments: string[],
  ) {
    super();
  }
}
