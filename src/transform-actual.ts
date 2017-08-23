import {
  config_namespace,
  ActualAssertionFlag,
  AssertionFlag,
  JestConfig,
} from './definitions';
import { create_actual_triggers } from './utils/create-actual-triggers';
import { create_triggers } from './utils/create-triggers';
import { get_config } from './utils/get-config';
import { get_formatted_description } from './utils/get-formatted-description';
import { remove_spaces } from './utils/remove-spaces';
import { rewrite_actual_triggers_method } from './utils/rewrite-actual-triggers-method';

export const transform_actual: jest.Transformer['process'] = (
  source_text,
  source_filename,
  jest_config: JestConfig,
) => {
  const { typescript: ts, tsconfig } = get_config(
    jest_config.globals[config_namespace],
    jest_config.rootDir,
  );

  const source_file = ts.createSourceFile(
    source_filename,
    source_text,
    ts.ScriptTarget.Latest,
    false,
  );
  const triggers = create_triggers(source_file, ts);

  const actual_triggers = create_actual_triggers(triggers, source_file, ts);
  rewrite_actual_triggers_method(actual_triggers);

  let transformed = source_text;

  actual_triggers.slice().reverse().forEach(trigger => {
    const assertion_expressions: string[] = [];

    if (trigger.flags.indexOf(AssertionFlag.Show) !== -1) {
      const safe_expression = remove_spaces(`
        (function () {
          try {
            return ${trigger.expression};
          } catch (error) {
            return error.message;
          }
        })()
      `);
      assertion_expressions.push(`console.log(${safe_expression})`);
    }

    if (trigger.value === ActualAssertionFlag.Error) {
      assertion_expressions.push(
        `expect(function () { return ${trigger.expression}; }).toThrowError()`,
      );
    } else if (trigger.value === ActualAssertionFlag.NoError) {
      assertion_expressions.push(
        `expect(function () { return ${trigger.expression}; }).not.toThrowError()`,
      );
    } else {
      assertion_expressions.push(
        `expect(${trigger.expression}).toEqual(${trigger.value})`,
      );
    }

    const description = JSON.stringify(
      get_formatted_description(trigger, true),
    );
    const assertion_expression = assertion_expressions.join(';');

    const prev_content = transformed.slice(0, trigger.start);
    const next_content = transformed.slice(trigger.end);
    const current_content = `${trigger.method}(${description}, function () { ${assertion_expression}; })`;

    transformed = `${prev_content}${current_content}${next_content}`;
  });

  if (jest_config._dts_jest_internal_test_ === true) {
    return transformed;
  }

  return ts.transpile(
    transformed,
    {
      ...tsconfig,
      inlineSourceMap: true,
    },
    source_filename,
  );
};
