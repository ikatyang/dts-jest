import {
  config_namespace,
  ActualAssertionFlag,
  AssertionFlag,
  JestConfig,
} from './definitions';
import { create_expecteds } from './utils/create-expecteds';
import { create_triggers } from './utils/create-triggers';
import { get_config } from './utils/get-config';
import { get_formatted_description } from './utils/get-formatted-description';
import { remove_spaces } from './utils/remove-spaces';
import { rewrite_expecteds_method } from './utils/rewrite-expecteds-method';

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

  const expecteds = create_expecteds(triggers, source_file, ts);
  rewrite_expecteds_method(expecteds);

  let transformed = source_text;

  expecteds.slice().reverse().forEach(expected => {
    const assertion_expressions: string[] = [];

    if (expected.flags.indexOf(AssertionFlag.Show) !== -1) {
      const safe_expression = remove_spaces(`
        (function () {
          try {
            return ${expected.expression};
          } catch (error) {
            return error.message;
          }
        })()
      `);
      assertion_expressions.push(`console.log(${safe_expression})`);
    }

    if (expected.value === ActualAssertionFlag.Error) {
      assertion_expressions.push(
        `expect(function () { return ${expected.expression}; }).toThrowError()`,
      );
    } else if (expected.value === ActualAssertionFlag.NoError) {
      assertion_expressions.push(
        `expect(function () { return ${expected.expression}; }).not.toThrowError()`,
      );
    } else {
      assertion_expressions.push(
        `expect(${expected.expression}).toEqual(${expected.value})`,
      );
    }

    const description = JSON.stringify(
      get_formatted_description(expected, true),
    );
    const assertion_expression = assertion_expressions.join(';');

    const prev_content = transformed.slice(0, expected.start);
    const next_content = transformed.slice(expected.end);
    const current_content = `${expected.method}(${description}, function () { ${assertion_expression}; })`;

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
