import * as fs from 'fs';
import * as path from 'path';
import {remap_snapshot} from './remap-snapshot';

export = (args: string[]) => {
  if (args.length !== 1) {
    throw new Error('Usage: dts-jest-remap-snapshot <path/to/__snapshots__/target.ts.snap>');
  }
  const snapshot_filename = args[0];
  const snapshot_content = fs.readFileSync(snapshot_filename, 'utf8');
  const source_content = fs.readFileSync(
    path.resolve(
      path.dirname(snapshot_filename),
      `../${path.basename(snapshot_filename, '.snap')}`,
    ),
    'utf8',
  );
  process.stdout.write(remap_snapshot(snapshot_content, source_content));
};
