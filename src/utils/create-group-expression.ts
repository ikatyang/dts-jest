import { TriggerGroup } from '../definitions';
import { get_group_description } from './get-group-description';

export const create_group_expression = (
  group: TriggerGroup,
  test_expression: string,
) => {
  // istanbul ignore next
  const { method, description: raw_description = '' } = group;
  const description = JSON.stringify(raw_description);
  return `${method}(${description}, function () { ${test_expression} })`;
};
