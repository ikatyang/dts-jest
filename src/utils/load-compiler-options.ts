import * as path from 'path';
import * as _ts from 'typescript';
import { create_message } from './create-message';
import { get_diagnostic_message } from './get-diagnostic-message';

export const load_compiler_options = (
  raw_options: string | Record<string, any>,
  ts: typeof _ts,
): { options: _ts.CompilerOptions; file_names: string[] } =>
  typeof raw_options === 'string'
    ? load_from_tsconfig(raw_options, ts)
    : load_from_raw_options(raw_options, ts);

function load_from_raw_options(
  raw_options: Record<string, any>,
  ts: typeof _ts,
) {
  const { errors, options } = ts.convertCompilerOptionsFromJson(
    raw_options,
    process.cwd(),
  );

  if (errors.length !== 0) {
    throw new Error(
      create_message(
        'Unexpected error(s) while loading compiler options:',
        errors.map(get_diagnostic_message),
      ),
    );
  }

  return { options, file_names: [] };
}

function load_from_tsconfig(filename: string, ts: typeof _ts) {
  const { config: tsconfig, error } = ts.readConfigFile(
    filename,
    ts.sys.readFile,
  );

  // istanbul ignore next
  if (error !== undefined) {
    throw new Error(
      create_message(
        `Unexpected error(s) while reading tsconfig (${filename}):`,
        [get_diagnostic_message(error)],
      ),
    );
  }

  const dirname = path.dirname(filename);

  const {
    errors,
    options,
    fileNames: file_names,
  } = ts.parseJsonConfigFileContent(tsconfig, ts.sys, dirname);

  if (errors.length !== 0) {
    throw new Error(
      create_message(
        `Unexpected error(s) while parsing tsconfig (${filename}):`,
        errors.map(get_diagnostic_message),
      ),
    );
  }

  return { options, file_names };
}
