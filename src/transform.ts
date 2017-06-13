import * as ts from 'typescript';
import {create_setup_expression} from './utils/create-setup-expression';
import {create_test_expression} from './utils/create-test-expression';
import {create_triggers} from './utils/create-triggers';

export const transform = (source_text: string, source_filename: string, _jest_config?: any) => {
  const source_file = ts.createSourceFile(source_filename, source_text, ts.ScriptTarget.Latest, false);

  const triggers = create_triggers(source_file);
  return triggers.reduce<string[]>(
    (transformed_line_texts, trigger) => {
      transformed_line_texts[trigger.line] += `${create_test_expression(trigger)};`;
      return transformed_line_texts;
    },
    source_text.split('\n').map((_, index) => (index !== 0) ? '' : `${create_setup_expression(triggers)};`),
  ).join('\n');
};
