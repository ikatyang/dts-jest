import { TriggerGroup, TriggerHeader } from '../definitions';

export const get_trigger_groups = (headers: TriggerHeader[]) => {
  const group_set = new Set<TriggerGroup>();
  headers.forEach(header => {
    if (header.group !== undefined) {
      group_set.add(header.group);
    }
  });
  return Array.from(group_set);
};
