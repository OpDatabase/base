#!/usr/bin/env node
// tslint:disable

/* istanbul ignore file */

import { Logger } from '@opdb/base';
import * as tsNode from 'ts-node';
import { cli } from './cli-handler.func';

// Register ts-node for typescript file imports accessed via API
tsNode.register();

(async () => {
  await cli();
})().catch(err => {
  Logger.error(err);
  process.exit(1);
}).then(() => {
  process.exit(0);
});
