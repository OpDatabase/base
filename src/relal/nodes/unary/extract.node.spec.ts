import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { ExtractNode } from './extract.node';

nodeTestCase('ExtractNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new ExtractNode(
      new SqlLiteralNode('FIELD'),
      'SUBFIELD',
    );
    const collector = visit(node);
    expect(collector.value).toBe('EXTRACT(SUBFIELD FROM FIELD)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('extract')).toStrictEqual(ExtractNode);
  });
});
