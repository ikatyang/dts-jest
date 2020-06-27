import * as ts from 'typescript';
import { load_fixture_source_file } from '../helpers/load-fixture';
import { trigger_header_serializer } from '../helpers/trigger-header-serializer';
import { find_trigger_headers } from './find-trigger-headers';

expect.addSnapshotSerializer(trigger_header_serializer);

it('should return correctly', () => {
  expect(find_headers('simple')).toMatchSnapshot();
});

it('should return correctly with group', () => {
  expect(find_headers('group')).toMatchSnapshot();
});

it('should return correctly with method', () => {
  expect(find_headers('method')).toMatchSnapshot();
});

it('should do nothing with unmatched comment', () => {
  expect(find_headers('unmatched')).toHaveLength(0);
});

it('should treat @ts-expect-error as @dts-jest:fail', () => {
  expect(find_headers('ts-expect-error')).toEqual(
    find_headers('ts-expect-error-equivalent'),
  );
});

function find_headers(id: string) {
  return find_trigger_headers(
    load_fixture_source_file(`find-trigger-headers/${id}.ts`, ts),
    ts,
  );
}
