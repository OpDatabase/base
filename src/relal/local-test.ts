// tslint:disable
import { QuotedNode, Table } from '.';

const table = new Table('users');
console.log(table.alias('alias_1'));

console.log(table.attribute('title').equal('Relal is cool').and(
  table.attribute('first_name').equal('Max Muster'),
  table.attribute('birthdate').greaterThan('2001-01-01 00:00:00'),
));

const x = table.where(
  table.attribute('title').equal('Example Query'),
).where(
  table.attribute('first_name').equal('Max Muster').or(
    table.attribute('first_name').equal('Marina Muster'),
  ),
).project(
  table.attribute('title'),
  table.attribute('first_name'),
  table.attribute('age').plus(new QuotedNode(5)),
);

console.log(x);
