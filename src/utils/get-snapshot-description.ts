import { Trigger } from '../definitions';
import { get_description_for_jest } from './get-description-for-jest';
import { get_group_description } from './get-group-description';

export const get_snapshot_description = (trigger: Trigger) => {
  const test_description = get_description_for_jest(trigger);
  return trigger.header.group === undefined
    ? test_description
    : `${get_group_description(trigger.header.group)} ${test_description}`;
};
