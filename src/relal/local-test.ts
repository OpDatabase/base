import { Table } from '.';

const table = new Table('users');
console.log(table.alias('alias_1'));

console.log(table.attribute('title').equal('Relal is cool').and(
  table.attribute('first_name').equal('Max Muster'),
  table.attribute('birthdate').greaterThan('2001-01-01 00:00:00'),
));

