// tslint:disable-next-line:no-implicit-dependencies
import { fail } from 'danger';
import { existsSync, readdirSync } from 'fs';

// Check if all beachball changes have been applied
if (existsSync('./change') && readdirSync('./change').length > 0) {
  fail(`There are pending beachball changes. To apply them, run: "beachball bump"!`);
}
