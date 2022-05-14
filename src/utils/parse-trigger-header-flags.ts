import { TriggerHeaderFlags } from '../definitions';

export const parse_trigger_header_flags = (unparsed_flags: string) => {
  let flags: TriggerHeaderFlags = 0;

  unparsed_flags
    .split(/(?=:)/)
    .filter(flag_literal => flag_literal.length !== 0)
    .forEach(flag_literal => {
      switch (flag_literal) {
        case TriggerHeaderFlags[TriggerHeaderFlags[':fail']]:
        case TriggerHeaderFlags[TriggerHeaderFlags[':pass']]:
        case TriggerHeaderFlags[TriggerHeaderFlags[':show']]:
        case TriggerHeaderFlags[TriggerHeaderFlags[':snap']]:
        case TriggerHeaderFlags[TriggerHeaderFlags[':not-any']]:
        case TriggerHeaderFlags[TriggerHeaderFlags[':only']]:
        case TriggerHeaderFlags[TriggerHeaderFlags[':skip']]:
        case TriggerHeaderFlags[TriggerHeaderFlags[':group']]:
          const current_flag: TriggerHeaderFlags = TriggerHeaderFlags[
            flag_literal as any
          ] as any;
          if (flags & current_flag) {
            throw new Error(`Duplicate flag '${flag_literal}'`);
          }
          flags = flags | current_flag;
          break;
        default:
          throw new Error(`Unexpected flag '${flag_literal}'`);
      }
    });

  if (
    flags & TriggerHeaderFlags[':pass'] &&
    flags & TriggerHeaderFlags[':fail']
  ) {
    const pass_flag_literal = TriggerHeaderFlags[TriggerHeaderFlags[':pass']];
    const fail_flag_literal = TriggerHeaderFlags[TriggerHeaderFlags[':fail']];
    throw new Error(
      `${pass_flag_literal} and ${fail_flag_literal} cannot be used simultaneously'`,
    );
  }

  if (
    flags & TriggerHeaderFlags[':group'] &&
    flags & TriggerHeaderFlags.Assertion
  ) {
    const group_flag_literal = TriggerHeaderFlags[TriggerHeaderFlags[':group']];
    throw new Error(
      `AssertionFlag is not allowed to be used with flag '${group_flag_literal}'`,
    );
  }

  return flags;
};
