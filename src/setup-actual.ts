import { ActualResult } from './definitions';
import { ActualRuntime } from './runtime-actual';

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
