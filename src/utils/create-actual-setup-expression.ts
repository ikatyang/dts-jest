import {
  package_name,
  runtime_namespace,
  ActualResult,
  ActualTrigger,
} from '../definitions';
import { remove_spaces } from './remove-spaces';

export const create_actual_setup_expression = (triggers: ActualTrigger[]) => {
  const results = triggers.reduce<ActualResult[]>(
    (current_targets, { line, description, expression, value }) => [
      ...current_targets,
      { line, description, expression, value },
    ],
    [],
  );

  const stringified_package_name = JSON.stringify(package_name);
  const stringified_results = JSON.stringify(results);

  return remove_spaces(`
    var ${runtime_namespace} = require(${stringified_package_name})
      .setup_actual(${stringified_results});
  `);
};
