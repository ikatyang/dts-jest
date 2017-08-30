import * as ts from 'typescript';
import { load_fixture_source_file } from '../helpers/load-fixture';
import { find_trigger_bodies } from './find-trigger-bodies';
import { find_trigger_headers } from './find-trigger-headers';

it('should return correctly', () => {
  expect(find_bodies('simple')).toMatchSnapshot();
});

it('should throw error if there are some unattachable bodies', () => {
  expect(() => find_bodies('unattachable')).toThrowErrorMatchingSnapshot();
});

it('should throw error if there are some invalid groups', () => {
  expect(() => find_bodies('invalid-group')).toThrowErrorMatchingSnapshot();
});

function find_bodies(id: string) {
  const source_file = load_fixture_source_file(
    `find-trigger-bodies/${id}.ts`,
    ts,
  );
  const headers = find_trigger_headers(source_file, ts);
  return find_trigger_bodies(source_file, headers, ts);
}
