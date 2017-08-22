import * as fs from 'fs';
import * as path from 'path';
import { JestConfig } from '../definitions';
import { transform } from '../transform';

const transform_fixture = (relative_path: string) => {
  const source_filename = path.resolve(__dirname, relative_path);
  const source_text = fs.readFileSync(source_filename, 'utf8');
  const jest_config: JestConfig = {
    rootDir: process.cwd(),
    globals: {},
  };
  return transform(source_text, source_filename, jest_config as any);
};

it('should transform correctly', () => {
  expect(
    transform_fixture('../../fixtures/transform/general.ts'),
  ).toMatchSnapshot();
});

it('should transform correctly with template token', () => {
  expect(
    transform_fixture('../../fixtures/transform/template-token.ts'),
  ).toMatchSnapshot();
});

it('should transform correctly with indented expression', () => {
  expect(
    transform_fixture('../../fixtures/transform/indented-expression.ts'),
  ).toMatchSnapshot();
});

it('should transform correctly with group flag', () => {
  expect(
    transform_fixture('../../fixtures/transform/group-flag.ts'),
  ).toMatchSnapshot();
});

it('should throw error with unexpected flag', () => {
  expect(() =>
    transform_fixture('../../fixtures/transform/unexpected.ts'),
  ).toThrowError();
});

it('should throw error with unattachable trigger(s)', () => {
  expect(() =>
    transform_fixture('../../fixtures/transform/unattachable.ts'),
  ).toThrowErrorMatchingSnapshot();
});
