jest.unmock('../transform');

import * as fs from 'fs';
import * as path from 'path';
import {transform} from '../transform';

it('should transform correctly', () => {
  const tsconfig = {some_option: 'some_value'};
  const source_filename = path.resolve(__dirname, '../../fixtures/transform/declaration.test.ts');
  const source_text = fs.readFileSync(source_filename, 'utf8');
  expect(transform({
    tsconfig,
    source_text,
    source_filename,
  })).toMatchSnapshot();
});
