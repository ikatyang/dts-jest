import {TriggerKind} from '../definitions';

export const get_test_method_name = (kind: TriggerKind) => {
  switch (kind) {
    case TriggerKind.None:
    case TriggerKind.Show:
      return 'test';
    case TriggerKind.Only:
      return 'test.only';
    case TriggerKind.Skip:
      return 'test.skip';
    default:
      throw new Error(`Unexpected kind ${JSON.stringify(kind)}`);
  }
};
