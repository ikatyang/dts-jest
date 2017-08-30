import { GroupMethod, Trigger, TestMethod } from '../definitions';
import {
  create_assertion_expression,
  CreateAssertionExpressionOptions,
} from './create-assertion-expression';
import { get_description_for_jest } from './get-description-for-jest';

export const create_test_expression = (
  trigger: Trigger,
  options: CreateAssertionExpressionOptions,
) => {
  const description = JSON.stringify(get_description_for_jest(trigger));
  const assertion_expression = create_assertion_expression(trigger, options);
  return `${GroupMethod.Test}(${description}, function () { ${assertion_expression} })`;
};
