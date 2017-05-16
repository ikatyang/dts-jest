import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import {ITSConfig} from '../definitions';

export const load_compiler_options = (tsconfig: ITSConfig, cwd: string = process.cwd()): ts.CompilerOptions => {
  const {
    compilerOptions: compiler_options = {},
  } = tsconfig;

  if (typeof tsconfig.extends === 'string') {
    const filename = path.resolve(cwd, tsconfig.extends);
    const {
      extends: target_extends,
      compilerOptions: parent_compiler_options = {},
    } = JSON.parse(fs.readFileSync(filename, 'utf-8'));

    return load_compiler_options(
      {
        extends: target_extends,
        compilerOptions: {
          ...parent_compiler_options,
          ...compiler_options,
        },
      },
      path.dirname(filename),
    );
  }

  return compiler_options;
};
