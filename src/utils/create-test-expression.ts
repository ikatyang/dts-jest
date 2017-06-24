import {runtime_namespace, AssertionFlag, Trigger} from '../definitions';
import {get_formatted_description} from './get-formatted-description';
import {remove_spaces} from './remove-spaces';

export const create_test_expression = (trigger: Trigger) => {
  const description = get_formatted_description(trigger, false);
  const stringified_description = JSON.stringify(description);

  const report_expression = `${runtime_namespace}.report(${trigger.line})`;
  const snapshot_expression = `${runtime_namespace}.snapshot(${trigger.line})`;
  const safe_snapshot_expression = `${runtime_namespace}.safe_snapshot(${trigger.line})`;

  const assertion_expression = (trigger.flag === AssertionFlag.Show)
    ? `console.log(${report_expression})`
    : (trigger.flag === AssertionFlag.Fail)
      ? `expect(function () { return ${snapshot_expression}; }).toThrowErrorMatchingSnapshot()`
      : (trigger.flag === AssertionFlag.Pass)
          ? `expect(${snapshot_expression}).toMatchSnapshot()`
          : `expect(${safe_snapshot_expression}).toMatchSnapshot()`;

  return remove_spaces(`
    ${trigger.method}(${stringified_description}, function () {
      ${assertion_expression};
    })
  `);
};
