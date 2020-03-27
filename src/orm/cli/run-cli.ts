#!/usr/bin/env node

import { Logger } from '@opdb/base';
import { cli } from './cli-handler.func';

(async () => {
  await cli();
})().catch(err => {
  Logger.error(err);
  process.exit(1);
}).then(() => {
  process.exit(0);
});
