import { Table } from '../table.class';
import { TestCollector } from '../tests/test.collector';
import { UnknownAttribute } from './unknown-attribute.class';

describe('Attribute', () => {
  it('should return the correct value once visited', async () => {
    const collector = new TestCollector();

    // Use UnknownAttribute instead of Attribute, since Attribute is abstract
    const attribute = new UnknownAttribute(new Table('table'), 'attribute');
    attribute.visit(collector);

    expect(collector.value).toBe('"table"."attribute"');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });
});
