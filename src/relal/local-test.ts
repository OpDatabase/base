import { Table } from './table.class';

const table = new Table('users');
console.log(table.alias('alias_1'));

table.attribute('title').equal('Relal is cool').and();
