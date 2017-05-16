jest.unmock('../load-tsconfig');

import {load_tsconfig} from '../load-tsconfig';

it('should return correctly while raw_tsconfig is string', () => {
  const tsconfig = 'path/to/somewhere';
  expect(load_tsconfig(tsconfig)).toEqual({
    extends: tsconfig,
  });
});

it('should return correctly while raw_tsconfig is object', () => {
  const tsconfig = {some_option: 'some_value'};
  expect(load_tsconfig(tsconfig)).toEqual({
    compilerOptions: tsconfig,
  });
});

it('should return correctly while raw_tsconfig is something else', () => {
  const tsconfig = undefined;
  expect(load_tsconfig(tsconfig)).toEqual({});
});
