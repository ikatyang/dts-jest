import {
  ActualAssertionFlag,
  ActualTrigger,
  AssertionFlag,
} from '../definitions';
import { get_formatted_description } from './get-formatted-description';
import { remove_spaces } from './remove-spaces';

export const create_actual_test_expression = (trigger: ActualTrigger) => {
  const assertion_expressions: string[] = [];

  if (trigger.flags.indexOf(AssertionFlag.Show) !== -1) {
    const safe_expression = `
      (function () {
        try {
          return ${trigger.expression};
        } catch (error) {
          return error.message;
        }
      })()
    `;
    assertion_expressions.push(`console.log(${safe_expression})`);
  }

  if (trigger.value === ActualAssertionFlag.Error) {
    assertion_expressions.push(
      `expect(function () { return ${trigger.expression}; }).toThrowError()`,
    );
  } else if (trigger.value === ActualAssertionFlag.NoError) {
    assertion_expressions.push(
      `expect(function () { return ${trigger.expression}; }).not.toThrowError()`,
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
