import { NormalizedConfig, RawConfig } from '../definitions';
import { load_compiler_options } from './load-compiler-options';
import { load_typescript } from './load-typescript';

export const normalize_config = (
  raw_config: RawConfig = {},
  root_dir: string,
): NormalizedConfig => {
  // istanbul ignore next
  const {
    test_type = true,
    test_value = false,
    compiler_options: raw_compiler_options = {},
    enclosing_declaration = false,
    typescript: typescript_id = 'typescript',
  } = raw_config;

  const { typescript, typescript_path } = load_typescript(
    replace_root_dir(typescript_id, root_dir),
  );

  // istanbul ignore next
  const {
    type_format_flags = typescript.TypeFormatFlags.NoTruncation,
  } = raw_config;

  const compiler_options = load_compiler_options(
    // istanbul ignore next
    typeof raw_compiler_options === 'string'
      ? replace_root_dir(raw_compiler_options, root_dir)
      : raw_compiler_options,
    root_dir,
    typescript,
  );

  return {
    test_type,
    test_value,
    compiler_options,
    type_format_flags,
    enclosing_declaration,
    typescript,
    typescript_path,
  };
};

function replace_root_dir(str: string, root_dir: string) {
  return str.replace('<rootDir>', root_dir);
}
