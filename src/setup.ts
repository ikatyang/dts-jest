import { env_root_dir, RawConfig, Result, Target } from './definitions';
import { Runtime } from './runtime';
import { create_snapshots } from './utils/create-snapshots';
import { get_env_variable } from './utils/env-variable';
import { get_config } from './utils/get-config';

export const setup = (
  filename: string,
  raw_config: RawConfig,
  targets: Target[],
) => {
  const { typescript: ts, tsconfig, type_format } = get_config(
    raw_config,
    get_env_variable(env_root_dir)!,
  );

  const lines = targets.map(target => target.line);
  const program = ts.createProgram([filename], tsconfig);
  const snapshots = create_snapshots(program, filename, lines, type_format, ts);

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
