// tslint:disable
import { DummySqlVisitor, Table } from '.';

const table = new Table('users').as('usertable');

const x = table.where(
  table.attribute('title').equal('Example Query'),
).where(
  table.attribute('first_name').equal('Max Muster').or(
    table.attribute('first_name').equal('Marina Muster'),
  ),
).project(
  table.attribute('title'),
  table.attribute('first_name'),
  table.attribute('age').plus(5).as('age_plus_five'),
);

const visitor = new DummySqlVisitor();
const result = visitor.accept(x.ast);

console.log(result.export());
