import {
  group_flag,
  AssertionFlag,
  GroupMethod,
  TestFlag,
  TestMethod,
  TriggerOrGroupInfo,
} from '../definitions';

export const get_trigger_of_group_info = (
  flags_str: string,
): TriggerOrGroupInfo => {
  const flags = flags_str.split(/(?=:)/g).filter(str => str.length !== 0);

  let is_group = false;

  let assertion_flag = AssertionFlag.Shot;
  let test_method = TestMethod.Test;
  let group_method = GroupMethod.Test;

  flags.forEach(flag_str => {
    switch (flag_str) {
      case group_flag:
        is_group = true;
        break;

      case TestFlag.Test:
        test_method = TestMethod.Test;
        group_method = GroupMethod.Test;
        break;
      case TestFlag.Only:
        test_method = TestMethod.Only;
        group_method = GroupMethod.Only;
        break;
      case TestFlag.Skip:
        test_method = TestMethod.Skip;
        group_method = GroupMethod.Skip;
        break;

      case AssertionFlag.Shot:
      case AssertionFlag.Show:
      case AssertionFlag.Pass:
      case AssertionFlag.Fail:
        assertion_flag = flag_str;
        break;

      default:
        throw new Error(`Unexpected flag ${JSON.stringify(flag_str)}`);
    }
  });

  return is_group
    ? { is_group, method: group_method }
    : { is_group, method: test_method, flag: assertion_flag };
};
