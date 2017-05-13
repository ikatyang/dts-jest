jest.unmock('../setup');

import * as fs from 'fs';
import * as path from 'path';
import {ITrigger} from '../definitions';
import {setup} from '../setup';

it('should setup correctly', () => {
  const tsconfig = {};
  const source_filename = path.resolve(__dirname, '../../fixtures/setup/declaration.test.ts');
  const triggers: ITrigger[] = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../../fixtures/setup/triggers.json'),
      'utf8',
    ),
  );
  const get_snapshot = setup({
    tsconfig,
    triggers,
    source_filename,
  }).snapshot;
  expect(`${
    triggers
      .map(({line}) => `trigger(line:${line}) -> ${get_snapshot(line)}`)
      .join('\n')
  }\n`).toMatchSnapshot();
});
