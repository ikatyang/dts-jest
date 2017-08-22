import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { remap_snapshot } from '../remap-snapshot';

const load_content = (relative_path: string) =>
  fs.readFileSync(
    path.resolve(__dirname, '../../fixtures/remap-snapshot', relative_path),
    'utf8',
  );

it('should remap correctly with snapshot-content string', () => {
  const source_content = load_content('example.ts');
  const snapshot_content = load_content('__snapshots__/example.ts.snap');
  expect(
    remap_snapshot(snapshot_content, source_content, undefined, ts),
  ).toMatchSnapshot();
});

it('should remap correctl with snapshot-content object', () => {
  const source_content = `
    // @dts-jest
    Math.max(1, 2, 3);
  `;
  const snapshot_content = {
    'Math.max(1, 2, 3) 1': '"number"',
  };
  expect(
    remap_snapshot(snapshot_content, source_content, undefined, ts),
  ).toMatchSnapshot();
});
