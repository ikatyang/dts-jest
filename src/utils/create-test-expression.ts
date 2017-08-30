import { Trigger } from '../definitions';
import { get_description_for_jest } from './get-description-for-jest';

export const create_test_expression = (
  trigger: Trigger,
  assertion_expression: string,
) => {
  const description = JSON.stringify(get_description_for_jest(trigger));
  const { header: { method } } = trigger;
  return `${method}(${description}, function () { ${assertion_expression} })`;
};
