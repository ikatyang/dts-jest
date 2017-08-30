import * as path from 'path';
import * as tsconfig_extends from 'tsconfig-extends';
import * as _ts from 'typescript';
import { create_message } from './create-message';
import { get_diagnostic_message } from './get-diagnostic-message';

export const load_compiler_options = (
  raw_options: string | Record<string, any>,
  base_path: string,
  ts: typeof _ts,
): _ts.CompilerOptions => {
  const filename = typeof raw_options === 'string' ? raw_options : undefined;

  const raw_compiler_options =
    typeof raw_options !== 'string'
      ? raw_options
      : tsconfig_extends.load_file_sync(filename!);

  const { errors, options } = ts.convertCompilerOptionsFromJson(
    raw_compiler_options,
    filename === undefined ? base_path : path.dirname(filename),
  );

  if (errors.length !== 0) {
    throw new Error(
      create_message(
        'Unexpected error(s) while loading compiler options:',
        errors.map(get_diagnostic_message),
      ),
    );
  }

  return options;
};
