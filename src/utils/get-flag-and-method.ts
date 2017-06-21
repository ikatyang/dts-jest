import {AssertionFlag, TestFlag, TestMethod} from '../definitions';

export const get_flag_and_method = (flags_str: string): {flag: AssertionFlag, method: TestMethod} => {
  let flag = AssertionFlag.Shot;
  let method = TestMethod.Test;

  const flags = flags_str.split(/(?=:)/g);
  flags.filter(str => str.length !== 0).forEach(flag_str => {
    switch (flag_str) {
      // test flag
      case TestFlag.Test: method = TestMethod.Test; break;
      case TestFlag.Only: method = TestMethod.Only; break;
      case TestFlag.Skip: method = TestMethod.Skip; break;
      // assertion flag
      case AssertionFlag.Shot:
      case AssertionFlag.Show:
      case AssertionFlag.Pass:
      case AssertionFlag.Fail:
        flag = flag_str;
        break;
      default:
        throw new Error(`Unexpected flag ${JSON.stringify(flag_str)}`);
    }
  });

  return {flag, method};
};
