jest.unmock('../transform');

import * as fs from 'fs';
import * as path from 'path';
import {transform} from '../transform';

it('should transform correctly', () => {
  const tsconfig = {some_option: 'some_value'};
  const raw_source_filename = '../../fixtures/transform/declaration.test.ts';
  const source_filename = path.resolve(__dirname, raw_source_filename);
  const source_text = fs.readFileSync(source_filename, 'utf8');
  expect(transform({
    tsconfig,
    source_text,
    source_filename: raw_source_filename,
  })).toMatchSnapshot();
});
