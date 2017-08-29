import {
  config_namespace,
  env_root_dir,
  runtime_namespace,
  JestConfig,
  Trigger,
} from './definitions';
import { apply_grouping } from './utils/apply-grouping';
import { create_assertion_expression } from './utils/create-assertion-expression';
import { create_setup_expression } from './utils/create-setup-expression';
import { create_source_file } from './utils/create-source-file';
import { create_test_expression } from './utils/create-test-expression';
import { find_triggers } from './utils/find-triggers';
import { get_trigger_groups } from './utils/get-trigger-groups';
import { get_trigger_body_line } from './utils/get-trigger-line';
import { normalize_config } from './utils/normalize-config';

export const transform: jest.Transformer['process'] = (
  source_text,
  source_filename,
  jest_config: JestConfig,
) => {
  // set for setup.ts
  process.env[env_root_dir] = jest_config.rootDir;

  const normalized_config = normalize_config(
    jest_config.globals[config_namespace],
    jest_config.rootDir,
  );

  const { typescript: ts, test_type } = normalized_config;

  const source_file = create_source_file(source_filename, source_text, ts);
  const triggers = find_triggers(source_file, ts);
  const groups = get_trigger_groups(triggers.map(trigger => trigger.header));

  const test_value =
    normalized_config.test_value &&
    triggers.some(trigger => trigger.footer !== undefined);

  const is_fake_environment = !test_value;

  const setup_expression = create_setup_expression(triggers);
  return `${setup_expression};${is_fake_environment
    ? get_fake_environment_transformed_content()
    : get_real_environment_transformed_content()}`;

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

      const test_expression = get_test_expression(
        trigger,
        test_type,
        test_value,
      );

      const { start, end } = trigger.body;

      transformed =
        transformed.slice(0, start) + test_expression + transformed.slice(end);
    }

    const transformed_line_contents = transformed.split('\n');
    return apply_grouping(transformed_line_contents, groups).join('\n');
  }
};

function get_test_expression(
  trigger: Trigger,
  test_type: boolean,
  test_value: boolean,
) {
  const body_line = get_trigger_body_line(trigger.header.line);
  const { body: { expression } } = trigger;

  const assertion_expression = create_assertion_expression(trigger, {
    test_type,
    test_value,
    get_type_inference_or_diagnostic_expression: `${runtime_namespace}.get_type_inference_or_diagnostic(${body_line})`,
    get_type_inference_or_throw_diagnostic_expression: `${runtime_namespace}.get_type_inference_or_throw_diagnostic(${body_line})`,
    get_type_report_expression: `${runtime_namespace}.get_type_report(${body_line})`,
    get_value_report_expression: `${runtime_namespace}.get_value_report(${body_line}, function () { return ${expression} })`,
  });

  return create_test_expression(trigger, assertion_expression);
}
