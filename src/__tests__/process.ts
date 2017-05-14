jest.unmock('../process');
jest.mock('../transform', () => ({transform: (options: any) => options}));

import {process} from '../process';

const source_text = '';
const source_filename = '';

const create_jest_config = <T>(globals: T) => ({
  globals,
  rootDir: 'path/to/somewhere',
});
const create_jest_config_with_tsconfig = <T>(tsconfig: T) => create_jest_config({
  _dts_jest_: {tsconfig},
});

const create_self_config_wrapper_with_tsconfig = <T>(tsconfig: T) => ({
  self_config: {
    tsconfig,
  },
});

it('(string) should use tsconfig to be "extends" property in tsconfig.json', () => {
  const tsconfig = 'path/to/tsconfig.json';
  const jest_config = create_jest_config_with_tsconfig(tsconfig);
  expect(process(source_text, source_filename, jest_config))
    .toMatchObject(create_self_config_wrapper_with_tsconfig({extends: tsconfig}));
});

it('(object) should use tsconfig to be "compilerOptions" property in tsconfig.json', () => {
  const tsconfig = {some_option: 'some_value'};
  const jest_config = create_jest_config_with_tsconfig(tsconfig);
  expect(process(source_text, source_filename, jest_config))
    .toMatchObject(create_self_config_wrapper_with_tsconfig({compilerOptions: tsconfig}));
});

// tslint:disable-next-line:max-line-length
it('(otherwise) should use empty object to be "compilerOptions" property in tsconfig.json', () => {
  const jest_config = create_jest_config({});
  expect(process(source_text, source_filename, jest_config))
    .toMatchObject(create_self_config_wrapper_with_tsconfig({compilerOptions: {}}));
});
