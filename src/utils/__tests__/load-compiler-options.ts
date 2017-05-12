jest.unmock('../load-compiler-options.ts');

import * as fs from 'fs';
import * as path from 'path';
import {load_compiler_options} from '../load-compiler-options';

it('should return empty object while there is no key "extends" or "compilerOptions" in tsconfig', () => {
  const tsconfig = {some_option: 'some_value'};
  expect(load_compiler_options(tsconfig)).toEqual({});
});

it('should return property "compilerOptions" while there is no key "extends" but "compilerOptions" in tsconfig', () => {
  const tsconfig = {compilerOptions: {some_option: 'some_value'}};
  expect(load_compiler_options(tsconfig)).toBe(tsconfig.compilerOptions);
});

const load_compiler_options_in_file = (tsconfig_filename: string) => {
  const filename = path.resolve(__dirname, tsconfig_filename);
  const dirname = path.dirname(filename);
  const tsconfig = JSON.parse(fs.readFileSync(filename, 'utf8'));
  return load_compiler_options(tsconfig, dirname);
};

it('should return extended "compilerOptions" while there is key "extends" in tsconfig (empty-object)', () => {
  expect(
    load_compiler_options_in_file('../../../fixtures/load-compier-options/empty-object/tsconfig.json'),
  ).toMatchSnapshot();
});

it('should return extended "compilerOptions" while there is key "extends" in tsconfig (same-folder)', () => {
  expect(
    load_compiler_options_in_file('../../../fixtures/load-compier-options/same-folder/tsconfig.json'),
  ).toMatchSnapshot();
});

it('should return extended "compilerOptions" while there is key "extends" in tsconfig (different-folder)', () => {
  expect(
    load_compiler_options_in_file('../../../fixtures/load-compier-options/different-folder/tsconfig.json'),
  ).toMatchSnapshot();
});
