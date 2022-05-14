import { TriggerGroup } from '../definitions';
import { create_group_expression } from './create-group-expression';

export const apply_grouping = (
  line_contents: string[],
  groups: TriggerGroup[],
) => {
  const grouped_line_contents = line_contents.slice();

  if (groups.length === 0) {
    return grouped_line_contents;
  }

  interface GroupScope {
    start_line: number;
    end_line: number;
    group: TriggerGroup;
  }

  const scopes: GroupScope[] = [];

  if (groups.length === 1) {
    const [group] = groups;
    scopes.push({
      group,
      start_line: group.line,
      end_line: line_contents.length - 1,
    });
  } else {
    let last_group = groups[0];

    for (let i = 1; i < groups.length; i++) {
      const group = groups[i];

      scopes.push({
        group: last_group,
        start_line: last_group.line,
        end_line: group.line,
      });

      last_group = group;
    }

    scopes.push({
      group: last_group,
      start_line: last_group.line,
      end_line: line_contents.length - 1,
    });
  }

  scopes
    .map(scope => {
      const [group_expression_left, group_expression_right] =
        `${create_group_expression(scope.group, '\n')};`.split('\n');

      grouped_line_contents[scope.start_line] =
        group_expression_left + grouped_line_contents[scope.start_line];

      return { scope, group_expression_right };
    })
    .forEach(({ scope, group_expression_right }, index) => {
      grouped_line_contents[scope.end_line] =
        index === scopes.length - 1
          ? grouped_line_contents[scope.end_line] + group_expression_right
          : group_expression_right + grouped_line_contents[scope.end_line];
    });

  return grouped_line_contents;
};
