import * as path from 'path';
import {Expressions, RawConfig} from '../definitions';
import {setup} from '../setup';

it('should setup correctly', () => {
  const filename = path.resolve(__dirname, '../../fixtures/snapshots/example.ts');
  const raw_config: RawConfig = {};
  const expressions: Expressions = {0: 'first', 3: 'second'};
  expect(setup(filename, raw_config, expressions)).toMatchSnapshot();
});

it('should setup correctly with specified tsconfig', () => {
  const filename = path.resolve(__dirname, '../../fixtures/snapshots/example.ts');
  const raw_config: RawConfig = {tsconfig: '<cwd>/fixtures/snapshots/tsconfig.json'};
  const expressions: Expressions = {0: 'first', 3: 'second'};
  expect(setup(filename, raw_config, expressions)).toMatchSnapshot();
});
