import * as ts from 'typescript';
import {Expressions, RawConfig} from './definitions';
import {Runtime} from './runtime';
import {create_snapshots} from './utils/create-snapshots';
import {get_tsconfig} from './utils/get-tsconfig';

export const setup = (filename: string, raw_config: RawConfig, expressions: Expressions) => {
  const lines = Object.keys(expressions).map(Number);

  const program = ts.createProgram([filename], get_tsconfig(raw_config));
  const snapshots = create_snapshots(program, filename, lines);

  return new Runtime(expressions, snapshots);
};
