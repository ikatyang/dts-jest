import { TriggerGroup } from '../definitions';

export const get_group_description = (group: TriggerGroup) => {
  // istanbul ignore next
  const { description = '' } = group;
  return description;
};
