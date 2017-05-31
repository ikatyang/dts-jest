import * as fs from 'fs';
import * as path from 'path';
import {transform} from '../transform';

const transform_fixture = (relative_path: string) => {
  const source_filename = path.resolve(__dirname, relative_path);
  const source_text = fs.readFileSync(source_filename, 'utf8');
  return transform(source_text, source_filename); // TODO
};

it('should transform correctly', () => {
  expect(transform_fixture('../../fixtures/transform/general.ts')).toMatchSnapshot();
});

it('should throw error with unexpected flag', () => {
  expect(() => transform_fixture('../../fixtures/transform/unexpected.ts')).toThrowError();
});

it('should throw error with unattachable trigger(s)', () => {
  expect(() => transform_fixture('../../fixtures/transform/unattachable.ts')).toThrowErrorMatchingSnapshot();
});
