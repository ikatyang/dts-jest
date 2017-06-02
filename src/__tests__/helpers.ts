import * as path from 'path';
import * as ts from 'typescript';
import {create_snapshots} from '../helpers';

test('create_snapshots() should return correctly', () => {
  const filename = path.resolve(__dirname, '../../fixtures/snapshots/example.ts');
  const lines = [0, 3];
  const program = ts.createProgram([filename], {});
  expect(create_snapshots(program, filename, lines)).toMatchSnapshot();
});
