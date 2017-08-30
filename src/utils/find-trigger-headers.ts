import * as _ts from 'typescript';
import {
  trigger_header_regex,
  GroupMethod,
  TestMethod,
  TriggerGroup,
  TriggerHeader,
  TriggerHeaderFlags,
  TriggerHeaderMatchIndex,
} from '../definitions';
import { for_each_comment } from './for-each-comment';
import { get_comment_content } from './get-comment-content';
import { parse_trigger_header_flags } from './parse-trigger-header-flags';

export const find_trigger_headers = (
  source_file: _ts.SourceFile,
  ts: typeof _ts,
) => {
  const headers: TriggerHeader[] = [];

  let last_group: TriggerGroup | undefined;

  for_each_comment(
    source_file,
    (comment, scanner) => {
      const match = get_comment_content(comment).match(trigger_header_regex);

      if (match === null) {
        return;
      }

      const description = match[TriggerHeaderMatchIndex.Description];
      const flags = parse_trigger_header_flags(
        match[TriggerHeaderMatchIndex.Flags],
      );

      const start = scanner.getTokenPos();
      const { line } = source_file.getLineAndCharacterOfPosition(start);

      if (flags & TriggerHeaderFlags[':group']) {
        last_group = {
          line,
          method: get_group_method(flags),
          description: description.length === 0 ? undefined : description,
        };
      } else {
        headers.push({
          line,
          flags,
          method: get_test_method(flags),
          description: description.length === 0 ? undefined : description,
          group: last_group,
        });
      }
    },
    ts,
  );

  return headers;
};

function get_test_method(flag: TriggerHeaderFlags) {
  return flag & TriggerHeaderFlags[':only']
    ? TestMethod.Only
    : flag & TriggerHeaderFlags[':skip'] ? TestMethod.Skip : TestMethod.Test;
}

function get_group_method(flag: TriggerHeaderFlags) {
  return flag & TriggerHeaderFlags[':only']
    ? GroupMethod.Only
    : flag & TriggerHeaderFlags[':skip'] ? GroupMethod.Skip : GroupMethod.Test;
}
