import { env_root_dir, ActualResult, RawConfig, Target } from './definitions';
import { ActualRuntime } from './runtime-actual';
import { create_snapshots } from './utils/create-snapshots';
import { default_to } from './utils/default-to';
import { get_env_variable } from './utils/env-variable';
import { get_config } from './utils/get-config';

export const setup_actual = (actual_results: ActualResult[]) => {
  const results = actual_results.reduce<{ [line: number]: ActualResult }>(
    (current_results, result) => ({
      ...current_results,
      [result.line]: result,
    }),
    {},
  );

  return new ActualRuntime(results);
};
