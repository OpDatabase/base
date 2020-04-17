// Import all nodes by importing index.ts
import '../../';
import { UnknownAttribute } from '../../attributes/unknown-attribute.class';
import { Table } from '../../table.class';
import { TestCollector } from '../../tests/test.collector';
import { TestVisitor } from '../../tests/test.visitor';
import { node } from '../nodes.register';
import { CastedNode } from './casted.node';

describe('CastedNode', () => {
  let collector: TestCollector;
  let visitor: TestVisitor;

  beforeEach(() => {
    collector = new TestCollector();
    visitor = new TestVisitor();
  });

  it('should return the given value on visit - default', async () => {
    // visitor.accept(object, collector)
    const exampleTable = new Table('test');
    const exampleAttribute = new UnknownAttribute(exampleTable, 'exampleAttribute');
    const spy = jest.spyOn(exampleAttribute, 'typeCastForDatabase');

    const node = new CastedNode('example value', exampleAttribute);
    const result = visitor.accept(node, collector) as TestCollector;
    expect(result.value).toBe('\'example value\'');
    expect(result.bindIndex).toBe(0);
    expect(result.boundValues).toStrictEqual([]);
    expect(spy).toBeCalledTimes(1);
  });

  it('should be accessible using register', async () => {
    expect(node('casted')).toStrictEqual(CastedNode);
  });
});
