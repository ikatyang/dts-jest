import * as path from 'path';
import { env_root_dir, RawConfig, Target } from '../definitions';
import { setup } from '../setup';
import { get_env_variable, set_env_variable } from '../utils/env-variable';

const original_root_dir = get_env_variable(env_root_dir);

beforeAll(() => set_env_variable(env_root_dir, process.cwd()));
afterAll(() => set_env_variable(env_root_dir, original_root_dir));

const get_filename = (filename: string) =>
  path.resolve(__dirname, `../../fixtures/snapshots/${filename}.ts`);

const targets: Target[] = [
  { line: 0, expression: 'first' },
  { line: 3, expression: 'second' },
];

it('should setup correctly', () => {
  const raw_config: RawConfig = {};
  expect(setup(get_filename('example'), raw_config, targets)).toMatchSnapshot();
});

it('should throw error if unmatched-diagnostic exist', () => {
  const raw_config: RawConfig = {};
  expect(() =>
    setup(get_filename('unmatched'), raw_config, targets),
  ).toThrowErrorMatchingSnapshot();
});

it('should setup correctly with specified tsconfig', () => {
  const raw_config: RawConfig = {
    tsconfig: '<rootDir>/fixtures/snapshots/tsconfig.json',
  };
  expect(setup(get_filename('example'), raw_config, targets)).toMatchSnapshot();
});
