import { FormattedConfig, RawConfig } from '../definitions';
import { default_to } from './default-to';
import { get_tsconfig } from './get-tsconfig';
import { get_typescript } from './get-typescript';

export const get_config = (
  raw_config: RawConfig = {},
  root_dir: string,
): FormattedConfig => {
  const { ts, ts_path } = get_typescript(raw_config.typescript, root_dir);
  return {
    tsconfig: get_tsconfig(raw_config.tsconfig, root_dir, ts),
    type_format: default_to(
      raw_config.type_format,
      ts.TypeFormatFlags.NoTruncation,
    ),
    typescript: ts,
    typescript_path: ts_path,
  };
};
