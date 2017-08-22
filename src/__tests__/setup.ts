import * as path from 'path';
import { RawConfig, Target } from '../definitions';
import { setup } from '../setup';

const filename = path.resolve(__dirname, '../../fixtures/snapshots/example.ts');
const targets: Target[] = [
  { line: 0, expression: 'first' },
  { line: 3, expression: 'second' },
];

it('should setup correctly', () => {
  const raw_config: RawConfig = {};
  expect(setup(filename, raw_config, targets)).toMatchSnapshot();
});

it('should setup correctly with specified tsconfig', () => {
  const raw_config: RawConfig = {
    tsconfig: '<rootDir>/fixtures/snapshots/tsconfig.json',
  };
  expect(setup(filename, raw_config, targets)).toMatchSnapshot();
});
