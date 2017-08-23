import { runtime_namespace, AssertionFlag, Trigger } from '../definitions';
import { get_formatted_description } from './get-formatted-description';
import { remove_spaces } from './remove-spaces';

export const create_test_expression = (trigger: Trigger) => {
  const description = get_formatted_description(trigger, false);
  const stringified_description = JSON.stringify(description);

  const report_expression = `${runtime_namespace}.report(${trigger.line})`;
  const snapshot_expression = `${runtime_namespace}.snapshot(${trigger.line})`;
  const safe_snapshot_expression = `${runtime_namespace}.safe_snapshot(${trigger.line})`;

  const assertion_expressions: string[] = [];

  if (trigger.flags.indexOf(AssertionFlag.Show) !== -1) {
    assertion_expressions.push(`console.log(${report_expression})`);
  }

  if (trigger.flags.indexOf(AssertionFlag.Pass) !== -1) {
    assertion_expressions.push(
      `expect(function () { return ${snapshot_expression}; }).not.toThrowError()`,
    );
  } else if (trigger.flags.indexOf(AssertionFlag.Fail) !== -1) {
    assertion_expressions.push(
      `expect(function () { return ${snapshot_expression}; }).toThrowError()`,
    );
  }

  if (trigger.flags.indexOf(AssertionFlag.Snapshot) !== -1) {
    assertion_expressions.push(
      `expect(${safe_snapshot_expression}).toMatchSnapshot()`,
    );
  }

  return remove_spaces(`
    ${trigger.method}(${stringified_description}, function () {
      ${assertion_expressions.join(';')};
    })
  `);
};
