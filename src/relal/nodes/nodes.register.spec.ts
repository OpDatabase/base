import { RelalException } from '../exceptions/relal.exception';
import { node, NodesRegister, register } from './nodes.register';

describe('NodesRegister', () => {
  it('should register a node class - using @register', async () => {
    @register('test-node-class')
    class TestNodeClass {
    }

    expect(NodesRegister.getNode('test-node-class')).toStrictEqual(TestNodeClass);
  });

  it('should register a node class - using NodesRegister.registerNode', async () => {
    class TestNodeClass2 {
    }

    NodesRegister.registerNode('test-node-class-2', TestNodeClass2);
    expect(NodesRegister.getNode('test-node-class-2')).toStrictEqual(TestNodeClass2);
  });

  it('should return a registered Node - using node function', async () => {
    class TestNodeClass3 {
    }

    NodesRegister.registerNode('test-node-class-3', TestNodeClass3);
    expect(node('test-node-class-3')).toStrictEqual(TestNodeClass3);
  });

  it('should throw when trying to access a non-registered node', async () => {
    expect(() => node('non-existing-node')).toThrowError(RelalException);
  });
});
