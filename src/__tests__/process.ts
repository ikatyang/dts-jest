jest.unmock('../process');
jest.mock('../transform', () => ({transform: (options: any) => options}));

import {process} from '../process';

const source_text = '';
const source_filename = '';

const create_configs = (tsconfig: any) => ({globals: {_dts_jest_: {tsconfig}}});

it('(string) should use tsconfig to be "extends" property in tsconfig.json', () => {
  const tsconfig = 'path/to/tsconfig.json';
  const configs = create_configs(tsconfig);
  expect(process(source_text, source_filename, configs)).toMatchObject({
    tsconfig: {extends: tsconfig},
  });
});

it('(object) should use tsconfig to be "compilerOptions" property in tsconfig.json', () => {
  const tsconfig = {some_option: 'some_value'};
  const configs = create_configs(tsconfig);
  expect(process(source_text, source_filename, configs)).toMatchObject({
    tsconfig: {compilerOptions: tsconfig},
  });
});

// tslint:disable-next-line:max-line-length
it('(otherwise) should use empty object to be "compilerOptions" property in tsconfig.json', () => {
  expect(process(source_text, source_filename, {globals: {}})).toMatchObject({
    tsconfig: {compilerOptions: {}},
  });
});
