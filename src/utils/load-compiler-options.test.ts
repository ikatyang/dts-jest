import * as ts from 'typescript';
import { get_fixture_filename } from '../helpers/load-fixture';
import { load_compiler_options } from './load-compiler-options';

it('should return correctly with tsconfig (filename)', () => {
  const tsconfig_id = 'load-compiler-options/tsconfig.json';
  const tsconfig_filename = get_fixture_filename(tsconfig_id);
  expect(load_compiler_options(tsconfig_filename, '', ts)).toMatchSnapshot();
});

it('should return correctly with tsconfig (raw-options)', () => {
  expect(
    load_compiler_options(
      {
        module: 'commonjs',
        target: 'es6',
        strict: true,
      },
      '',
      ts,
    ),
  ).toMatchSnapshot();
});

it('should throw error if there are some invalid values', () => {
  expect(() =>
    load_compiler_options(
      {
        module: 'commonjssssss',
        target: 'es666666',
      },
      '',
      ts,
    ),
  ).toThrowErrorMatchingSnapshot();
});
