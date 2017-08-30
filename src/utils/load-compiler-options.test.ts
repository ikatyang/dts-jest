import * as ts from 'typescript';
import { get_fixture_filename } from '../helpers/load-fixture';
import { load_compiler_options } from './load-compiler-options';

it('should return correctly with tsconfig (filename)', () => {
  expect(load_options('example')).toMatchSnapshot();
});

it('should return correctly with tsconfig (raw-options)', () => {
  expect(
    load_options({
      module: 'commonjs',
      target: 'es6',
      strict: true,
    }),
  ).toMatchSnapshot();
});

it('should throw error if there are some invalid values', () => {
  expect(() =>
    load_options({
      module: 'commonjssssss',
      target: 'es666666',
    }),
  ).toThrowErrorMatchingSnapshot();
});

it('should throw error if parse tsconfig failed', () => {
  expect(() => load_options('invalid')).toThrowErrorMatchingSnapshot();
});

function load_options(raw_options: string | Record<string, any>) {
  return load_compiler_options(
    typeof raw_options === 'string'
      ? get_fixture_filename(
          `load-compiler-options/${raw_options}/tsconfig.json`,
        )
      : raw_options,
    ts,
  );
}
