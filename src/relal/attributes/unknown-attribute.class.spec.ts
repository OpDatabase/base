import { Table } from '../table.class';
import { UnknownAttribute } from './unknown-attribute.class';

describe('UnknownAttribute', () => {
  it('should return the correct type cast value', async () => {
    const attribute = new UnknownAttribute(new Table('table'), 'attribute');
    expect(attribute.typeCastForDatabase('value')).toStrictEqual('value');
    // todo: support more types
  });
});
