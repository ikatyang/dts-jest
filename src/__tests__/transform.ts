jest.unmock('../transform');

import * as fs from 'fs';
import * as path from 'path';
import {transform} from '../transform';

it('should transform correctly', () => {
  const source_text = fs.readFileSync(path.resolve(__dirname, '../../fixtures/transform/general/test.ts'), 'utf8');
  expect(transform(source_text)).toMatchSnapshot();
});
