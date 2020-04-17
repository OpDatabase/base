import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { DistinctNode } from './distinct.node';

nodeTestCase('DistinctNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new DistinctNode();
    const collector = visit(node);
    expect(collector.value).toBe('DISTINCT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('distinct')).toStrictEqual(DistinctNode);
  });
});

