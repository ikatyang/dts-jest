import { config_namespace, JestConfig } from './definitions';
import { create_actual_setup_expression } from './utils/create-actual-setup-expression';
import { create_actual_test_expression } from './utils/create-actual-test-expression';
import { create_actual_triggers } from './utils/create-actual-triggers';
import { create_triggers } from './utils/create-triggers';
import { get_config } from './utils/get-config';
import { skipify_triggers_method } from './utils/skipify-triggers-method';

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
  skipify_triggers_method(actual_triggers);

  let transformed = source_text;

  actual_triggers.slice().reverse().forEach(trigger => {
    const prev_content = transformed.slice(0, trigger.start);
    const next_content = transformed.slice(trigger.end);
    const test_expression = create_actual_test_expression(trigger);

    transformed = `${prev_content}${test_expression};${next_content}`;
  });

  transformed = create_actual_setup_expression(actual_triggers) + transformed;

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
