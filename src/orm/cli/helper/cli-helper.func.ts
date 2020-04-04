import { Logger } from '@opdb/base';
import { resolve } from 'path';

export function getPath(target: string): string {
  return resolve(process.cwd(), target);
}

export function logFileCreated(filePath: string) {
  Logger.debug(`Created "${filePath}"`);
}
