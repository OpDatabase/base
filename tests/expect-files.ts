import { existsSync, readFileSync } from 'fs';

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function expectFileToExist(path: string): void {
  const status = fileExists(path);
  if (!status) {
    console.log(`expectFileToExist: "${path}" does not exist!`);
  }
  expect(status).toBeTruthy();
}

export function expectFileContents(path: string, expectedContents: string): void {
  const actualContents = readFileSync(path, { encoding: 'utf-8' });
  expect(actualContents).toStrictEqual(expectedContents);
}
