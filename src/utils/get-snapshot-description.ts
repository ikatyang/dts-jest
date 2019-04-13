import { Trigger } from '../definitions';
import { snapshot_assertion_message } from './create-assertion-expression';
import { get_description_for_jest } from './get-description-for-jest';
import { get_group_description } from './get-group-description';

export const get_snapshot_description = (trigger: Trigger) => {
  const test_description = get_description_for_jest(trigger);
  if (trigger.header.group === undefined) {
    return `${test_description} ${snapshot_assertion_message}`;
  }
  const group_description = get_group_description(trigger.header.group);
  return `${group_description} ${test_description} ${snapshot_assertion_message}`;
};
