import * as JestTransform from '@jest/transform';
import {
  config_namespace,
  runtime_namespace,
  JestConfig,
  Trigger,
} from './definitions';
import { apply_grouping } from './utils/apply-grouping';
import { create_message } from './utils/create-message';
import { create_setup_expression } from './utils/create-setup-expression';
import { create_source_file } from './utils/create-source-file';
import { create_test_expression } from './utils/create-test-expression';
import { find_docblock_options } from './utils/find-docblock-options';
import { find_triggers } from './utils/find-triggers';
import { get_diagnostic_message } from './utils/get-diagnostic-message';
import { get_trigger_groups } from './utils/get-trigger-groups';
import { get_trigger_body_line } from './utils/get-trigger-line';
import { normalize_config } from './utils/normalize-config';

export const transform = (
  source_text: string,
  source_filename: string,
  { config: jest_config }: { config: JestConfig },
): ReturnType<JestTransform.SyncTransformer['process']> => {
  const normalized_config = normalize_config(
    jest_config.globals[config_namespace],
  );

  const { typescript: ts, compiler_options, transpile } = normalized_config;

  const source_file = create_source_file(source_filename, source_text, ts);
  const triggers = find_triggers(source_file, ts);
  const groups = get_trigger_groups(triggers.map(trigger => trigger.header));

  const docblock_options = find_docblock_options(source_file, ts);
  const { test_type = normalized_config.test_type } = docblock_options;
  let { test_value = normalized_config.test_value } = docblock_options;

  if (triggers.every(trigger => trigger.footer === undefined)) {
    test_value = false;
  }

  const is_fake_environment = !test_value;

  const setup_expression = create_setup_expression(triggers);
  return {
    code: `${setup_expression};${
      is_fake_environment
        ? get_fake_environment_transformed_content()
        : get_real_environment_transformed_content()
    }`,
  };

  function get_fake_environment_transformed_content() {
    const transformed_line_contents = source_text.split('\n').map(() => '');

    triggers.forEach(trigger => {
      const test_expression = get_test_expression(
        trigger,
        test_type,
        test_value,
      );

      const body_line = get_trigger_body_line(trigger.header.line);

      transformed_line_contents[body_line] += test_expression;
    });

    return apply_grouping(transformed_line_contents, groups).join('\n');
  }

  function get_real_environment_transformed_content() {
    let transformed = source_text;

    for (let i = triggers.length - 1; i >= 0; i--) {
      const trigger = triggers[i];

      const { start, end, text } = trigger.body;
      const test_expression =
        get_test_expression(trigger, test_type, test_value) +
        text.replace(/[^\n]/g, ''); // add missing line break so as to retain line number

      transformed =
        transformed.slice(0, start) + test_expression + transformed.slice(end);
    }

    transformed = apply_grouping(transformed.split('\n'), groups).join('\n');

    if (!transpile) {
      return transformed;
    }

    const transpile_output = ts.transpileModule(transformed, {
      compilerOptions: compiler_options,
      fileName: source_filename,
    });

    // istanbul ignore next
    if (
      transpile_output.diagnostics !== undefined &&
      transpile_output.diagnostics.length !== 0
    ) {
      throw new Error(
        create_message(
          `Unexpected error while transpiling '${source_filename}':`,
          transpile_output.diagnostics.map(get_diagnostic_message),
        ),
      );
    }

    return transpile_output.outputText;
  }
};

function get_test_expression(
  trigger: Trigger,
  test_type: boolean,
  test_value: boolean,
) {
  const body_line = get_trigger_body_line(trigger.header.line);
  const {
    body: { text },
  } = trigger;

  return create_test_expression(trigger, {
    test_type,
    test_value,
    get_type_inference_or_diagnostic_expression: `${runtime_namespace}.get_type_inference_or_diagnostic(${body_line})`,
    get_type_inference_or_throw_diagnostic_expression: `${runtime_namespace}.get_type_inference_or_throw_diagnostic(${body_line})`,
    get_type_report_expression: `${runtime_namespace}.get_type_report(${body_line})`,
    get_value_report_expression: `${runtime_namespace}.get_value_report(${body_line}, function () { return ${text} })`,
  });
}
