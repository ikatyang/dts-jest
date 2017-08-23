import * as path from 'path';
import * as _ts from 'typescript';
import { ActualTrigger, Trigger } from '../definitions';
import { for_each_comment } from './for-each-comment';
import { get_expression_end_line } from './get-expression-end-line';

export const create_actual_triggers = (
  triggers: Trigger[],
  source_file: _ts.SourceFile,
  ts: typeof _ts,
) => {
  const current_triggers = triggers.slice();

  const actual_triggers: ActualTrigger[] = [];
  const unmatched_comment_lines: number[] = [];

  for_each_comment(
    source_file,
    (comment, scanner) => {
      const match =
        comment.match(/^\/\/=>(.*)$/) || comment.match(/^\/\*=>([\s\S]*)\*\/$/);
      if (match === null) {
        return;
      }
      const position = scanner.getTokenPos();
      const { line: comment_line } = source_file.getLineAndCharacterOfPosition(
        position,
      );

      if (current_triggers.length === 0) {
        unmatched_comment_lines.push(comment_line);
      }

      while (current_triggers.length !== 0) {
        const trigger = current_triggers[0];
        const expression_end_line = get_expression_end_line(trigger);

        if (comment_line < expression_end_line) {
          unmatched_comment_lines.push(comment_line);
          break;
        }

        current_triggers.shift();

        if (comment_line !== expression_end_line) {
          continue;
        }

        const [, value] = match;
        actual_triggers.push({
          ...trigger,
          value: value.trim(),
        });
        break;
      }
    },
    ts,
  );

  if (unmatched_comment_lines.length !== 0) {
    const relative_filename = path.relative(
      process.cwd(),
      source_file.fileName,
    );
    throw new Error(
      `Unattachable expected-value(s) detected:\n\n${unmatched_comment_lines
        .map(line => `  ${relative_filename}:${line + 1}`)
        .join('\n')
        .replace(/\s+$/gm, '')}`,
    );
  }

  return actual_triggers;
};
