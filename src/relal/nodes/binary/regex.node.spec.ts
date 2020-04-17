import { FeatureNotAvailableException } from '../../exceptions/feature-not-available.exception';
import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { NotRegexNode, RegexNode } from './regex.node';

nodeTestCase('RegexNode', visit => {
  it('should return the given value on visit - any value', async () => {
    const node = new RegexNode(
      new SqlLiteralNode('COLUMN'),
      /\s/,
    );
    expect(() => visit(node)).toThrowError(FeatureNotAvailableException);
  });

  it('should be accessible using register', async () => {
    expect(node('regex')).toStrictEqual(RegexNode);
  });
});

nodeTestCase('NotRegexNode', visit => {
  it('should return the given value on visit - any value', async () => {
    const node = new NotRegexNode(
      new SqlLiteralNode('COLUMN'),
      /\s/,
    );
    expect(() => visit(node)).toThrowError(FeatureNotAvailableException);
  });

  it('should be accessible using register', async () => {
    expect(node('not-regex')).toStrictEqual(NotRegexNode);
  });
});
