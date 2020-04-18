import { nodeTestCase } from '../tests/node-test-case.func';
import { BindParamNode } from './bind-param.node';
import { node } from './nodes.register';

nodeTestCase('BindParamNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new BindParamNode(
      'example value',
    );
    const collector = visit(node);
    expect(collector.value).toBe('$placeholder0');
    expect(collector.bindIndex).toBe(1);
    expect(collector.boundValues).toStrictEqual(['example value']);
  });

  it('should be accessible using register', async () => {
    expect(node('bind-param')).toStrictEqual(BindParamNode);
  });
});
