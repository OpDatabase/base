import { FeatureNotAvailableException } from '../exceptions/feature-not-available.exception';
import { nodeTestCase } from '../tests/node-test-case.func';
import { node } from './nodes.register';
import { SqlLiteralNode } from './sql-literal.node';
import { DistinctOnNode, GroupNode, LateralNode, LockNode, NotNode, OffsetNode, OnNode, OptimizerHintsNode } from './unary.node';
import { QuotedNode } from './unary/quoted.node';

nodeTestCase('DistinctOnNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new DistinctOnNode(0);
    expect(() => visit(node)).toThrowError(FeatureNotAvailableException);
  });

  it('should be accessible using register', async () => {
    expect(node('distinct-on')).toStrictEqual(DistinctOnNode);
  });
});

nodeTestCase('GroupNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new GroupNode(new SqlLiteralNode('STATEMENT'));
    const collector = visit(node);
    expect(collector.value).toBe('STATEMENT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('group')).toStrictEqual(GroupNode);
  });
});

nodeTestCase('LateralNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new LateralNode(0);
    expect(() => visit(node)).toThrowError(FeatureNotAvailableException);
  });

  it('should be accessible using register', async () => {
    expect(node('lateral')).toStrictEqual(LateralNode);
  });
});

nodeTestCase('LockNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new LockNode(new SqlLiteralNode('STATEMENT'));
    const collector = visit(node);
    expect(collector.value).toBe('STATEMENT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('lock')).toStrictEqual(LockNode);
  });
});

nodeTestCase('NotNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new NotNode(new SqlLiteralNode('STATEMENT'));
    const collector = visit(node);
    expect(collector.value).toBe('NOT (STATEMENT)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('not')).toStrictEqual(NotNode);
  });
});

nodeTestCase('OffsetNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new OffsetNode(new QuotedNode(1));
    const collector = visit(node);
    expect(collector.value).toBe('OFFSET \'1\'');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('offset')).toStrictEqual(OffsetNode);
  });
});

nodeTestCase('OnNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new OnNode(new SqlLiteralNode('STATEMENT'));
    const collector = visit(node);
    expect(collector.value).toBe('ON STATEMENT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('on')).toStrictEqual(OnNode);
  });
});

nodeTestCase('OptimizerHintsNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new OptimizerHintsNode(['Hint']);
    const collector = visit(node);
    expect(collector.value).toBe('/*+ Hint */');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('optimizer-hints')).toStrictEqual(OptimizerHintsNode);
  });
});
