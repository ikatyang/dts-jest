import {
  runtime_namespace,
  ActualAssertionFlag,
  ActualTrigger,
  AssertionFlag,
} from '../definitions';
import { get_formatted_description } from './get-formatted-description';
import { remove_spaces } from './remove-spaces';

export const create_actual_test_expression = (trigger: ActualTrigger) => {
  const assertion_expressions: string[] = [];
  const getter_expression = `function () { return ${trigger.expression}; }`;

  if (trigger.flags.indexOf(AssertionFlag.Show) !== -1) {
    const report_expression = `${runtime_namespace}.report(${trigger.line}, ${getter_expression})`;
    assertion_expressions.push(`console.log(${report_expression})`);
  }

  if (trigger.value === ActualAssertionFlag.Error) {
    assertion_expressions.push(`expect(${getter_expression}).toThrowError()`);
  } else if (trigger.value === ActualAssertionFlag.NoError) {
    assertion_expressions.push(
      `expect(${getter_expression}).not.toThrowError()`,
    );
  } else {
    assertion_expressions.push(
      `expect(${trigger.expression}).toEqual(${trigger.value})`,
    );
  }

  const description = get_formatted_description(trigger, true);
  const stringified_description = JSON.stringify(description);

  return remove_spaces(`
    ${trigger.method}(${stringified_description}, function () {
      ${assertion_expressions.join(';')};
    })
  `);
};
