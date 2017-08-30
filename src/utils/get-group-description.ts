import { TriggerGroup } from '../definitions';

export const get_group_description = (group: TriggerGroup) => {
  const { description = '' } = group;
  return description;
};
