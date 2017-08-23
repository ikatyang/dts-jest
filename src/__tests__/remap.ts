import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { remap } from '../remap';

const load_content = (relative_path: string) =>
  fs.readFileSync(
    path.resolve(__dirname, '../../fixtures/remap', relative_path),
    'utf8',
  );

it('should remap correctly with snapshot-content string', () => {
  const source_content = load_content('general.ts');
  const snapshot_content = load_content('__snapshots__/general.ts.snap');
  expect(
    remap(source_content, snapshot_content, { typescript: ts }),
  ).toMatchSnapshot();
});

it('should remap correctl with snapshot-content object', () => {
  const source_content = `
    // @dts-jest:snapshot
    Math.max(1, 2, 3);
  `;
  const snapshot_content = {
    'Math.max(1, 2, 3) 1': '"number"',
  };
  expect(
    remap(source_content, snapshot_content, { typescript: ts }),
  ).toMatchSnapshot();
});

it('should throw error if snapshot is unmatched', () => {
  const source_content = load_content('unmatched.ts');
  const snapshot_content = load_content('__snapshots__/unmatched.ts.snap');
  expect(() =>
    remap(source_content, snapshot_content, { typescript: ts }),
  ).toThrowErrorMatchingSnapshot();
});

it('should remap correctly for :skip flag', () => {
  const source_content = load_content('skip.ts');
  const snapshot_content = load_content('__snapshots__/skip.ts.snap');
  expect(
    remap(source_content, snapshot_content, { typescript: ts }),
  ).toMatchSnapshot();
});

it('should remap correctly for :only flag', () => {
  const source_content = load_content('only.ts');
  const snapshot_content = load_content('__snapshots__/only.ts.snap');
  expect(
    remap(source_content, snapshot_content, { typescript: ts }),
  ).toMatchSnapshot();
});
