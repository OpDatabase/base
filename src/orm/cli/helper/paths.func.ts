import { Logger } from '@opdb/base';
import path from 'path';

export function getPath(target: string): string {
  return path.resolve(path.relative(process.cwd(), target));
}

export function logFileCreated(filePath: string) {
  Logger.debug(`Created "${filePath}"`);
}
