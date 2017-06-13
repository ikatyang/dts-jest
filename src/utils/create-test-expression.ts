import {runtime_namespace, Trigger, TriggerFlag} from '../definitions';
import {default_to} from './default-to';
import {remove_spaces} from './remove-spaces';

export const create_test_expression = (trigger: Trigger) => {
  const description = default_to(trigger.description, trigger.expression).replace(/\n/g, '\n    ');
  const stringified_description = JSON.stringify(description);

  const report_expression = `${runtime_namespace}.report(${trigger.line})`;
  const snapshot_expression = `${runtime_namespace}.snapshot(${trigger.line})`;
  const assertion_expression = (trigger.flag === TriggerFlag.Show)
    ? `console.log(${report_expression})`
    : `expect(${snapshot_expression}).toMatchSnapshot()`;

  return remove_spaces(`
    ${trigger.method}(${stringified_description}, function () {
      ${assertion_expression};
    })
  `);
};
