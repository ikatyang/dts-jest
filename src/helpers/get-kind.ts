import {TriggerKind} from '../definitions';

export const get_kind = (flag?: string) => {
  switch (flag) {
    case ':show':
      return TriggerKind.Show;
    case ':skip':
      return TriggerKind.Skip;
    case ':only':
      return TriggerKind.Only;
    case undefined:
      return TriggerKind.None;
    default:
      throw new Error(`Unexpected flag ${JSON.stringify(flag)}`);
  }
};
