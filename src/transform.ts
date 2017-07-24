import * as ts from 'typescript';
import { Group } from './definitions';
import { create_group_expression } from './utils/create-group-expression';
import { create_setup_expression } from './utils/create-setup-expression';
import { create_test_expression } from './utils/create-test-expression';
import { create_triggers } from './utils/create-triggers';

export const transform = (
  source_text: string,
  source_filename: string,
  _jest_config?: any,
) => {
  const source_file = ts.createSourceFile(
    source_filename,
    source_text,
    ts.ScriptTarget.Latest,
    false,
  );

  let last_group: Group | undefined;
  const triggers = create_triggers(source_file);
  return triggers
    .reduce<string[]>((transformed_line_texts, trigger, index) => {
      const is_diff_group = trigger.group !== last_group;

      write_group_close_if_preset(is_diff_group && last_group !== undefined);
      write_group_open_if_preset(is_diff_group);
      write(create_test_expression(trigger), true);
      write_group_close_if_preset(
        trigger.group !== undefined && index === triggers.length - 1,
      );

      last_group = trigger.group;
      return transformed_line_texts;

      function write(str: string, trailing_semicolon: boolean) {
        transformed_line_texts[trigger.line] +=
          str + (trailing_semicolon ? ';' : '');
      }
      function write_group_open_if_preset(value: boolean) {
        if (!value) {
          return;
        }
        write(create_group_expression(trigger.group!, { type: 'open' }), false);
      }
      function write_group_close_if_preset(value: boolean) {
        if (!value) {
          return;
        }
        write(create_group_expression(trigger.group!, { type: 'close' }), true);
      }
    }, source_text.split('\n').map((_, index) => (index !== 0 ? '' : `${create_setup_expression(triggers)};`)))
    .join('\n');
};
