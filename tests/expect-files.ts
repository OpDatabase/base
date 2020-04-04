import { existsSync, readFileSync } from 'fs';

export function expectFileToExist(path: string): void {
  expect(existsSync(path)).toBeTruthy();
}

export function expectFileContents(path: string, expectedContents: string): void {
  const actualContents = readFileSync(path, { encoding: 'utf-8' });
  expect(actualContents).toStrictEqual(expectedContents);
}
