import * as dts_jest from './index';

it(`should have method 'transform'`, () => {
  expect(dts_jest.transform).toBeInstanceOf(Function);
});

it(`should have method 'setup'`, () => {
  expect(dts_jest.setup).toBeInstanceOf(Function);
});

it(`should have class 'Reporter'`, () => {
  expect(dts_jest.Reporter).toBeInstanceOf(Function);
});

it(`should have method 'remap'`, () => {
  expect(dts_jest.remap).toBeInstanceOf(Function);
});

it(`should have method 'remap_cli'`, () => {
  expect(dts_jest.remap_cli).toBeInstanceOf(Function);
});

it(`should have method 'create_remap_cli_parser'`, () => {
  expect(dts_jest.create_remap_cli_parser).toBeInstanceOf(Function);
});
