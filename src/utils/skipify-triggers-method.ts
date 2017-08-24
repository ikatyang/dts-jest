import { Group, GroupMethod, TestMethod, Trigger } from '../definitions';
import { default_to } from './default-to';

export const skipify_triggers_method = (triggeres: Trigger[]): void => {
  const groups: Group[] = [];
  const grouped_triggers = triggeres.reduce<{
    [index: number]: Trigger[];
  }>((current_grouped_triggers, trigger) => {
    if (trigger.group === undefined) {
      safe_push(-1);
    } else {
      const index = groups.findIndex(group => group === trigger.group);
      safe_push(index === -1 ? groups.push(trigger.group) - 1 : index);
    }

    return current_grouped_triggers;

    function safe_push(index: number) {
      current_grouped_triggers[index] = default_to(
        current_grouped_triggers[index],
        [] as Trigger[],
      );
      current_grouped_triggers[index].push(trigger);
    }
  }, {});

  const only_group_index = groups.findIndex(
    group => group.method === GroupMethod.Only,
  );
  if (only_group_index !== -1) {
    Object.keys(grouped_triggers)
      .map(Number)
      .filter(index => index !== only_group_index)
      .forEach(index => {
        const triggers = grouped_triggers[+index];
        skipify_triggers(triggers);
      });
  }

  if (-1 in grouped_triggers) {
    rewrite_triggers(grouped_triggers[-1]);
  }
  groups.forEach((group, group_index) => {
    const triggers = grouped_triggers[group_index];
    if (group.method === GroupMethod.Skip) {
      skipify_triggers(triggers);
    } else {
      rewrite_triggers(triggers);
    }
  });

  function rewrite_triggers(triggers: Trigger[]) {
    const only_test_index = triggers.findIndex(
      trigger => trigger.method === TestMethod.Only,
    );

    if (only_test_index === -1) {
      return;
    }

    triggers[only_test_index].method = TestMethod.Test;
    skipify_triggers(triggers.filter((_, index) => index !== only_test_index));
  }

  function skipify_triggers(triggers: Trigger[]) {
    triggers.forEach(trigger => {
      trigger.method = TestMethod.Skip;
    });
  }
};
