import {config_namespace, package_name, runtime_namespace, Target, Trigger} from '../definitions';
import {remove_spaces} from './remove-spaces';

export const create_setup_expression = (triggers: Trigger[]) => {
  const targets = triggers.reduce<Target[]>(
    (current_targets, {line, description, expression}) =>
      ([...current_targets, {line, description, expression}]),
    [],
  );

  const stringified_package_name = JSON.stringify(package_name);
  const stringified_targets = JSON.stringify(targets);

  const config_expression = remove_spaces(`
    (function () {
      try {
        return ${config_namespace};
      } catch (e) {
        return {};
      }
    })()
  `);

  return remove_spaces(`
    var ${runtime_namespace};
    beforeAll(function () {
      ${runtime_namespace} = require(${stringified_package_name})
        .setup(module.filename, ${config_expression}, ${stringified_targets});
    })
  `);
};
