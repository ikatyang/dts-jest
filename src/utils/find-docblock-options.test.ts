import * as ts from 'typescript';
import { load_fixture_source_file } from '../helpers/load-fixture';
import { find_docblock_options } from './find-docblock-options';

it('should not read from normal comment', () => {
  expect(find_options('normal-comment')).toEqual({});
});

it('should not read from non-first docblock', () => {
  expect(find_options('second-docblock')).toEqual({});
});

it('should find enable:test-type correctly', () => {
  expect(find_options('enable-test-type')).toMatchSnapshot();
});

it('should find enable:test-value correctly', () => {
  expect(find_options('enable-test-value')).toMatchSnapshot();
});

it('should find disable:test-type correctly', () => {
  expect(find_options('disable-test-type')).toMatchSnapshot();
});

it('should find disable:test-value correctly', () => {
  expect(find_options('disable-test-value')).toMatchSnapshot();
});

it('should find multi option value correctly', () => {
  expect(find_options('multi-option-value')).toMatchSnapshot();
});

it('should throw error if there is unexpected value', () => {
  expect(() => find_options('unexpected')).toThrowErrorMatchingSnapshot();
});

function find_options(id: string) {
  const source_file = load_fixture_source_file(
    `find-docblock-options/${id}.ts`,
    ts,
  );
  return find_docblock_options(source_file, ts);
}
