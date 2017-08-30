import * as ts from 'typescript';
import { TestMethod, TriggerHeader } from '../definitions';
import { load_fixture_source_file } from '../helpers/load-fixture';
import { find_trigger_headers } from './find-trigger-headers';
import { normalize_trigger_header_methods } from './normalize-trigger-header-methods';

it('should not be affected without only', () => {
  const headers = get_normalized_headers('no-only');
  expect(get_headers_info(headers)).toMatchSnapshot();
  expect(get_header_only_count(headers)).toBe(0);
});

it('should normalize correctly with group-only', () => {
  const headers = get_normalized_headers('group-only');
  expect(get_headers_info(headers)).toMatchSnapshot();
  expect(get_header_only_count(headers)).toBe(0);
});

it('should normalize correctly with trigger-only', () => {
  const headers = get_normalized_headers('trigger-only');
  expect(get_headers_info(headers)).toMatchSnapshot();
  expect(get_header_only_count(headers)).toBe(0);
});

it('should normalize correctly with trigger-only in group-only', () => {
  const headers = get_normalized_headers('trigger-only-in-group-only');
  expect(get_headers_info(headers)).toMatchSnapshot();
  expect(get_header_only_count(headers)).toBe(0);
});

it('should normalize correctly with trigger-only in group-skip', () => {
  const headers = get_normalized_headers('trigger-only-in-group-skip');
  expect(get_headers_info(headers)).toMatchSnapshot();
  expect(get_header_only_count(headers)).toBe(0);
});

it('should normalize correctly with multi group-only', () => {
  const headers = get_normalized_headers('multi-group-only');
  expect(get_headers_info(headers)).toMatchSnapshot();
  expect(get_header_only_count(headers)).toBe(0);
});

it('should normalize correctly with multi trigger-only', () => {
  const headers = get_normalized_headers('multi-trigger-only');
  expect(get_headers_info(headers)).toMatchSnapshot();
  expect(get_header_only_count(headers)).toBe(0);
});

it('should normalize correctly with multi group-only and trigger-only', () => {
  const headers = get_normalized_headers('multi-mixed-only');
  expect(get_headers_info(headers)).toMatchSnapshot();
  expect(get_header_only_count(headers)).toBe(0);
});

function get_normalized_headers(id: string) {
  const source_file = load_fixture_source_file(
    `normalize-trigger-header-methods/${id}.ts`,
    ts,
  );
  const headers = find_trigger_headers(source_file, ts);
  normalize_trigger_header_methods(headers);
  return headers;
}

function get_header_only_count(headers: TriggerHeader[]) {
  return headers.filter(header => header.method === TestMethod.Only).length;
}

function get_headers_info(headers: TriggerHeader[]) {
  return headers.map(header => `${header.description} -> ${header.method}`);
}
