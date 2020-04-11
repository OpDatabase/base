import { Node } from '..';

export class CommentNode extends Node {
  constructor(
    public readonly comments: string[],
  ) {
    super();
  }
}
