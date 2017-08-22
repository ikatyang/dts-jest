import { config_namespace, AssertionFlag, JestConfig } from './definitions';
import { create_expecteds } from './utils/create-expecteds';
import { create_triggers } from './utils/create-triggers';
import { get_config } from './utils/get-config';
import { get_formatted_description } from './utils/get-formatted-description';
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
    const assertion_expression =
      expected.flag === AssertionFlag.Show
        ? `console.log(${expected.expression})`
        : expected.flag === AssertionFlag.Fail
          ? `expect(function () { return ${expected.expression}; }).toThrowError()`
          : expected.flag === AssertionFlag.Pass
            ? `expect(${expected.expression}).toEqual(${expected.value})`
            : `expect(function () { return ${expected.expression}; }).not.toThrowError()`;
    const description = get_formatted_description(expected, true);
    transformed = `${transformed.slice(
      0,
      expected.start,
    )}${`${expected.method}(${JSON.stringify(
      description,
    )}, function () { ${assertion_expression}; })`}${transformed.slice(
      expected.end,
    )}`;
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
