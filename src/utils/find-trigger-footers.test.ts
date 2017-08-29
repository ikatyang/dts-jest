import * as ts from 'typescript';
import { load_fixture_source_file } from '../helpers/load-fixture';
import { find_trigger_bodies } from './find-trigger-bodies';
import { find_trigger_footers } from './find-trigger-footers';
import { find_trigger_headers } from './find-trigger-headers';

it('should return correctly', () => {
  expect(find_footers('simple')).toMatchSnapshot();
});

it('should throw error if there are some unattachable footers', () => {
  expect(() => find_footers('unattachable')).toThrowErrorMatchingSnapshot();
});

function find_footers(id: string) {
  const source_file = load_fixture_source_file(
    `find-trigger-footers/${id}.ts`,
    ts,
  );
  const headers = find_trigger_headers(source_file, ts);
  const bodies = find_trigger_bodies(source_file, headers, ts);
  return find_trigger_footers(source_file, bodies, ts);
}
