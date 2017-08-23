import * as path from 'path';
import * as tsconfig_extends from 'tsconfig-extends';
import * as _ts from 'typescript';
import { RawConfig } from '../definitions';
import { replace_root_dir } from './replace-root-dir';

export const get_tsconfig = (
  raw_tsconfig: RawConfig['tsconfig'] = {},
  root_dir: string,
  ts: typeof _ts,
): _ts.CompilerOptions => {
  const filename =
    typeof raw_tsconfig === 'string'
      ? replace_root_dir(raw_tsconfig, root_dir)
      : undefined;

  const dirname = filename === undefined ? root_dir : path.dirname(filename);

  const raw_compiler_options =
    filename === undefined
      ? raw_tsconfig
      : tsconfig_extends.load_file_sync(filename);
  const { errors, options } = ts.convertCompilerOptionsFromJson(
    raw_compiler_options,
    dirname,
  );

  // istanbul ignore next
  if (errors.length !== 0) {
    throw new Error(
      errors
        .map(
          error =>
            typeof error.messageText === 'string'
              ? error.messageText
              : error.messageText.messageText,
        )
        .join('\n'),
    );
  }

  return options;
};
