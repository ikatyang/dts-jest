import {runtime_namespace, AssertionFlag, Trigger} from '../definitions';
import {default_to} from './default-to';
import {remove_spaces} from './remove-spaces';
import {repeat} from './repeat';

const jest_title_leading_spaces_count = 4;
const jest_grouped_title_leading_spaces_count = 6;

export const create_test_expression = (trigger: Trigger) => {
  const description = default_to(trigger.description, trigger.expression)
    .replace(/\n/g, `\n${
      repeat(
        ' ',
        (trigger.group === undefined)
          ? jest_title_leading_spaces_count
          : jest_grouped_title_leading_spaces_count,
        )
    }`);
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
