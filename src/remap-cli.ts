import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { remap } from './remap';

export const remap_cli = (args: string[]) => {
  if (args.length !== 1) {
    throw new Error(
      'Usage: dts-jest-remap-snapshot <path/to/__snapshots__/target.ts.snap>',
    );
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
  process.stdout.write(
    remap(source_content, snapshot_content, { typescript: ts }),
  );
};
