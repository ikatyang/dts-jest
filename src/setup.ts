import { RawConfig, Result, Target } from './definitions';
import { Runtime } from './runtime';
import { create_snapshots } from './utils/create-snapshots';
import { default_to } from './utils/default-to';
import { get_config } from './utils/get-config';
import { get_root_dir } from './utils/root-dir';

export const setup = (
  filename: string,
  raw_config: RawConfig,
  targets: Target[],
) => {
  const { typescript: ts, tsconfig } = get_config(raw_config, get_root_dir());

  const lines = targets.map(target => target.line);

  const flag = default_to(
    raw_config.type_format,
    ts.TypeFormatFlags.NoTruncation,
  );
  const program = ts.createProgram([filename], tsconfig);

  const snapshots = create_snapshots(program, filename, lines, flag, ts);
  const results = targets.reduce<{ [line: number]: Result }>(
    (current_results, target) => ({
      ...current_results,
      [target.line]: {
        ...target,
        ...snapshots[target.line],
      },
    }),
    {},
  );

  return new Runtime(results);
};
