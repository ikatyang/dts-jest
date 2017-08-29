import * as fs from 'fs';
import * as path from 'path';
import * as _ts from 'typescript';
import { create_source_file } from '../utils/create-source-file';

export const get_fixture_filename = (id: string) =>
  path.resolve(__dirname, '../../fixtures', id);

export const load_fixture = (id: string) =>
  fs.readFileSync(get_fixture_filename(id), 'utf8');

export const load_fixture_source_file = (id: string, ts: typeof _ts) => {
  const source = load_fixture(id);
  return create_source_file(id, source, ts);
};
