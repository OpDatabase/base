import { nodeTestCase } from '../tests/node-test-case.func';
import { CommentNode } from './comment.node';
import { node } from './nodes.register';

nodeTestCase('CommentNode', visit => {
  it('should return the given value on visit - singular value', async () => {
    const node = new CommentNode([
      'Example Comment',
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('/* Example Comment */');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - multiple values', async () => {
    const node = new CommentNode([
      'Example Comment',
      'Example Comment 2',
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('/* Example Comment *//* Example Comment 2 */');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('comment')).toStrictEqual(CommentNode);
  });
});
