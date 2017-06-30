import * as fs from 'fs';
import * as path from 'path';
import {remap_snapshot} from '../remap-snapshot';

const load_content = (relative_path: string) =>
  fs.readFileSync(path.resolve(__dirname, '../../fixtures/remap-snapshot', relative_path), 'utf8');

it('should remap correctly', () => {
  const source_content = load_content('example.ts');
  const snapshot_content = load_content('__snapshots__/example.ts.snap');
  expect(remap_snapshot(snapshot_content, source_content)).toMatchSnapshot();
});
