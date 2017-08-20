import { Expected, Group, GroupMethod, TestMethod } from '../definitions';
import { default_to } from './default-to';

export const rewrite_expecteds_method = (
  target_expecteds: Expected[],
): void => {
  const groups: Group[] = [];
  const grouped_expecteds = target_expecteds.reduce<{
    [index: number]: Expected[];
  }>((current_grouped_expecteds, expected) => {
    if (expected.group === undefined) {
      safe_push(-1);
    } else {
      const index = groups.findIndex(group => group === expected.group);
      safe_push(index === -1 ? groups.push(expected.group) - 1 : index);
    }

    return current_grouped_expecteds;

    function safe_push(index: number) {
      current_grouped_expecteds[index] = default_to(
        current_grouped_expecteds[index],
        [] as Expected[],
      );
      current_grouped_expecteds[index].push(expected);
    }
  }, {});

  const only_group_index = groups.findIndex(
    group => group.method === GroupMethod.Only,
  );
  if (only_group_index !== -1) {
    Object.keys(grouped_expecteds)
      .map(Number)
      .filter(index => index !== only_group_index)
      .forEach(index => {
        const expecteds = grouped_expecteds[+index];
        skipify_expecteds(expecteds);
      });
  }

  if (-1 in grouped_expecteds) {
    rewrite_expecteds(grouped_expecteds[-1]);
  }
  groups.forEach((group, group_index) => {
    const expecteds = grouped_expecteds[group_index];
    if (group.method === GroupMethod.Skip) {
      skipify_expecteds(expecteds);
    } else {
      rewrite_expecteds(expecteds);
    }
  });

  function rewrite_expecteds(expecteds: Expected[]) {
    const only_test_index = expecteds.findIndex(
      expected => expected.method === TestMethod.Only,
    );

    if (only_test_index === -1) {
      return;
    }

    expecteds[only_test_index].method = TestMethod.Test;
    skipify_expecteds(
      expecteds.filter((_, index) => index !== only_test_index),
    );
  }
  function skipify_expecteds(expecteds: Expected[]) {
    expecteds.forEach(expected => {
      expected.method = TestMethod.Skip;
    });
  }
};
