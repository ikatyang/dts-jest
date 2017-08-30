import * as _ts from 'typescript';
import {
  trigger_footer_regex,
  TriggerBody,
  TriggerFooter,
  TriggerFooterFlag,
  TriggerFooterMatchIndex,
} from '../definitions';
import { create_message } from './create-message';
import { for_each_comment } from './for-each-comment';
import { get_comment_content } from './get-comment-content';
import { get_display_line } from './get-display-line';
import { get_trigger_body_end_line } from './get-trigger-line';
import { normalize_expected_value } from './normalize-expected-value';

export const find_trigger_footers = (
  source_file: _ts.SourceFile,
  bodies: TriggerBody[],
  ts: typeof _ts,
) => {
  const footers: TriggerFooter[] = [];

  const body_end_line_set = new Set(
    bodies.map(
      body => source_file.getLineAndCharacterOfPosition(body.end).line,
    ),
  );

  const unattachable_lines: number[] = [];

  for_each_comment(
    source_file,
    (comment, scanner) => {
      const match = get_comment_content(comment).match(trigger_footer_regex);

      if (match === null) {
        return;
      }

      const start = scanner.getTokenPos();
      const { line: footer_line } = source_file.getLineAndCharacterOfPosition(
        start,
      );

      const body_end_line = get_trigger_body_end_line(footer_line);

      if (!body_end_line_set.has(body_end_line)) {
        unattachable_lines.push(footer_line);
        return;
      }

      body_end_line_set.delete(body_end_line);

      const value = match[TriggerFooterMatchIndex.Value];

      switch (value) {
        case TriggerFooterFlag.Show:
        case TriggerFooterFlag.Error:
        case TriggerFooterFlag.NoError:
          footers.push({
            line: footer_line,
            flag: value,
          });
          break;
        default:
          footers.push({
            line: footer_line,
            expected: normalize_expected_value(
              value,
              source_file.fileName,
              footer_line,
              ts,
            ),
          });
          break;
      }
    },
    ts,
  );

  if (unattachable_lines.length !== 0) {
    throw new Error(
      create_message(
        'Unattachable trigger-footer(s) detected:',
        unattachable_lines.map(
          line => `${source_file.fileName}:${get_display_line(line)}`,
        ),
      ),
    );
  }

  return footers;
};
