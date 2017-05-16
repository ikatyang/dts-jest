import {
  config_namespace,
  runtime_namespace,
  trigger_regex,
  IJestConfig,
  ITrigger,
  ITriggerDescriptions,
  ITriggerMatchArray,
  TriggerMatchIndex,
} from './definitions';
import {get_assertion_expression} from './helpers/get-assertion-expression';
import {get_description_expression} from './helpers/get-description-expression';
import {get_kind} from './helpers/get-kind';
import {get_test_method_name} from './helpers/get-test-method-name';

export const transform = (source_text: string, _source_filename?: string, _jest_config?: IJestConfig) => {

  const line_texts = source_text.split('\n');

  const triggers = line_texts.reduce(
    (current_triggers: ITrigger[], line_text, index) => {
      const matched = line_text.match(trigger_regex);
      if (matched !== null) {
        const trigger_match_array = matched as ITriggerMatchArray;
        current_triggers.push({
          line: index,
          kind: get_kind(trigger_match_array[TriggerMatchIndex.Flag]),
          // tslint:disable-next-line strict-boolean-expressions
          description: trigger_match_array[TriggerMatchIndex.Description] || null,
        });
      }
      return current_triggers;
    },
    [],
  );

  const trigger_descriptions: ITriggerDescriptions = triggers.reduce(
    (current_triggers, trigger) => ({...current_triggers, [trigger.line]: trigger.description}),
    {},
  );

  const transformed_line_texts = line_texts.map(() => '');
  const get_config_expression = `(function () { try { return ${config_namespace}; } catch (e) { return {}; } })()`;
  transformed_line_texts[0] += `var ${runtime_namespace} = require('dts-jest')`
    + `.setup(module, ${get_config_expression}, ${JSON.stringify(trigger_descriptions)});`;

  triggers.forEach(trigger => {
    const {line, kind} = trigger;
    const test_method_name = get_test_method_name(kind);
    const assertion_expression = get_assertion_expression(kind, line);
    const description_expression = get_description_expression(line);
    transformed_line_texts[line] +=
      `${test_method_name}(${description_expression}, function () { ${assertion_expression}; });`;
  });

  return transformed_line_texts.join('\n');
};
