jest.mock('./utils/create-setup-expression.ts', () => ({
  create_setup_expression: () => '<create_setup_expression>',
}));

import { JestConfig, RawConfig } from './definitions';
import { get_fixture_filename, load_fixture } from './helpers/load-fixture';
import { transform } from './transform';

it('should transform correctly with { test_type: false, test_value: false }', () => {
  expect(
    transform_fixture('all', { test_type: false, test_value: false }),
  ).toMatchSnapshot();
});

it('should transform correctly with { test_type: true, test_value: false }', () => {
  expect(
    transform_fixture('all', { test_type: true, test_value: false }),
  ).toMatchSnapshot();
});

it('should transform correctly with { test_type: false, test_value: true }', () => {
  expect(
    transform_fixture('all', { test_type: false, test_value: true }),
  ).toMatchSnapshot();
});

it('should transform correctly with { test_type: true, test_value: true }', () => {
  expect(
    transform_fixture('all', { test_type: true, test_value: true }),
  ).toMatchSnapshot();
});

it('should transform to fake environment for no-footers even if test_value = true', () => {
  expect(
    transform_fixture('no-footers', { test_type: true, test_value: true }),
  ).toMatchSnapshot();
});

function transform_fixture(id: string, raw_config: RawConfig) {
  const full_id = `transform/${id}.ts`;
  const filename = get_fixture_filename(full_id);
  const source = load_fixture(full_id);
  const config: JestConfig = {
    rootDir: '',
    globals: { _dts_jest_: raw_config },
  };
  return transform(source, filename, config as any);
}
