import { TriggerGroup } from '../definitions';
import { get_group_description } from './get-group-description';

export const create_group_expression = (
  group: TriggerGroup,
  test_expression: string,
) => {
  const description = JSON.stringify(get_group_description(group));
  return `${group.method}(${description}, function () { ${test_expression} })`;
};
