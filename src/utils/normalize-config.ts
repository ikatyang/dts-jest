import { NormalizedConfig, RawConfig } from '../definitions';
import { load_compiler_options } from './load-compiler-options';
import { load_typescript } from './load-typescript';

export const normalize_config = (
  raw_config: RawConfig = {},
): NormalizedConfig => {
  // istanbul ignore next
  const {
    test_type = true,
    test_value = false,
    compiler_options: raw_compiler_options = {},
    enclosing_declaration = false,
    typescript: typescript_id = 'typescript',
    transpile = true,
  } = raw_config;

  const { typescript, typescript_path } = load_typescript(typescript_id);

  // istanbul ignore next
  const {
    type_format_flags = typescript.TypeFormatFlags.NoTruncation,
  } = raw_config;

  const compiler_options = load_compiler_options(
    raw_compiler_options,
    typescript,
  );

  return {
    transpile,
    test_type,
    test_value,
    compiler_options,
    type_format_flags,
    enclosing_declaration,
    typescript,
    typescript_path,
  };
};
