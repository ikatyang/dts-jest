import * as path from 'path';
import * as ts_comment from 'ts-comment';
import * as ts from 'typescript';
import {trigger_regex, Trigger, TriggerMatchArray, TriggerMatchIndex} from '../definitions';
import {default_to} from './default-to';
import {get_flag_and_method} from './get-flag-and-method';
import {repeat} from './repeat';
import {traverse_node} from './traverse-node';

export const create_triggers = (source_file: ts.SourceFile): Trigger[] => {
  type PartialTrigger = Pick<Trigger, 'flag' | 'method' | 'description'>;
  const partial_triggers: {[line: number]: PartialTrigger} = {};

  ts_comment.for_each(source_file, (comment, scanner) => {
    const match = comment.match(trigger_regex);
    if (match !== null) {
      const trigger_match = match as TriggerMatchArray;

      const {flag, method} = get_flag_and_method(trigger_match[TriggerMatchIndex.Flags]);
      const description = trigger_match[TriggerMatchIndex.Description];

      const position = scanner.getTokenPos();
      const {line} = source_file.getLineAndCharacterOfPosition(position);

      partial_triggers[line] = {
        flag,
        method,
        description,
      };
    }
  });

  const triggers: Trigger[] = [];
  const line_starts = source_file.getLineStarts();

  traverse_node(source_file, node => {
    const position = node.getStart(source_file);
    const {line: expression_line} = source_file.getLineAndCharacterOfPosition(position);
    const trigger_line = expression_line - 1;

    if (trigger_line in partial_triggers) {
      try {
        const leading_space_width = node.getStart(source_file) - line_starts[expression_line];
        const expression = node.getText(source_file)
          .replace(/\s*;?\s*$/, '')
          .replace(/^ */mg, spaces =>
            repeat(' ', Math.max(0, spaces.length - leading_space_width)),
          );

        const partial_trigger = partial_triggers[trigger_line];
        delete partial_triggers[trigger_line];

        triggers.push({
          expression,
          line: trigger_line,
          ...partial_trigger,
        });
      } catch (e) {
        // do nothing
      }
    }
  });

  const unattachable_lines = Object.keys(partial_triggers).map(Number);
  if (unattachable_lines.length !== 0) {
    const relative_filename = path.relative(process.cwd(), source_file.fileName);
    throw new Error(`Unattachable trigger(s) detected:\n\n${
      unattachable_lines
        .map(line => `  ${relative_filename}:${line + 1} ${default_to(partial_triggers[line].description, '')}`)
        .join('\n')
        .replace(/\s+$/mg, '')
    }`);
  }

  return triggers;
};
