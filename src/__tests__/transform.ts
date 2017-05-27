import * as fs from 'fs';
import * as path from 'path';
import {transform} from '../transform';

const source_text = fs.readFileSync(path.resolve(__dirname, '../../fixtures/transform/general.ts'), 'utf8');

it('should transform correctly', () => {
  expect(transform(source_text)).toMatchSnapshot();
});

it('should throw error with unexpected flag', () => {
  expect(() => transform('// @dts-jest:unexpected')).toThrowError();
});
