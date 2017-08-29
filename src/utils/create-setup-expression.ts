import {
  config_namespace,
  package_name,
  runtime_namespace,
  Trigger,
} from '../definitions';

export const create_setup_expression = (triggers: Trigger[]) => {
  const config_expression = `(function () { try { return ${config_namespace} } catch (e) { return {} } })()`;
  return (
    `var ${runtime_namespace} = require(${JSON.stringify(package_name)})` +
    `.setup(module.filename, ${config_expression}, ${JSON.stringify(triggers)})`
  );
};
