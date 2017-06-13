import {TestMethod, TriggerFlag} from '../definitions';

export const get_flag_and_method = (flag: string): {flag: TriggerFlag, method: TestMethod} => {
  switch (flag) {
    case TriggerFlag.None:
    case TriggerFlag.Show:
      return {flag, method: TestMethod.Test};
    case TriggerFlag.Skip:
      return {flag, method: TestMethod.Skip};
    case TriggerFlag.Only:
      return {flag, method: TestMethod.Only};
    default:
      throw new Error(`Unexpected flag ${JSON.stringify(flag)}`);
  }
};
