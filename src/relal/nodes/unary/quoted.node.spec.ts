import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { QuotedNode } from './quoted.node';

nodeTestCase('QuotedNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new QuotedNode('Statement');
    const collector = visit(node);
    expect(collector.value).toBe('\'Statement\'');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('quoted')).toStrictEqual(QuotedNode);
  });
});
