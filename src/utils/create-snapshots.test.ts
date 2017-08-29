import * as ts from 'typescript';
import { cwd_serializer } from '../helpers/cwd-serializer';
import {
  get_fixture_filename,
  load_fixture_source_file,
} from '../helpers/load-fixture';
import { create_snapshots } from './create-snapshots';
import { find_triggers } from './find-triggers';
import { normalize_config } from './normalize-config';

expect.addSnapshotSerializer(cwd_serializer);

it('should create correctly', () => {
  expect(get_snapshots('example')).toMatchSnapshot();
});

it('should return empty array if there is no assertion', () => {
  expect(get_snapshots('no-assertion')).toHaveLength(0);
});

it('should throw error of there are some unmatched diagnostics', () => {
  expect(() => get_snapshots('unmatched')).toThrowErrorMatchingSnapshot();
});

function get_snapshots(id: string) {
  const full_id = `create-snapshots/${id}.ts`;
  const filename = get_fixture_filename(full_id);
  const source_file = load_fixture_source_file(full_id, ts);
  const triggers = find_triggers(source_file, ts);
  const config = normalize_config({}, process.cwd());
  return create_snapshots(filename, triggers, config);
}
