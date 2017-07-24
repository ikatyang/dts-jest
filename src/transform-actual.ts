import * as ts from 'typescript';
import { AssertionFlag, JestConfig } from './definitions';
import { create_expecteds } from './utils/create-expecteds';
import { create_triggers } from './utils/create-triggers';
import { default_to } from './utils/default-to';
import { get_formatted_description } from './utils/get-formatted-description';
import { get_tsconfig } from './utils/get-tsconfig';
import { rewrite_expecteds_method } from './utils/rewrite-expecteds-method';

export const transform_actual = (
  source_text: string,
  source_filename: string,
  jest_config: JestConfig,
) => {
  const source_file = ts.createSourceFile(
    source_filename,
    source_text,
    ts.ScriptTarget.Latest,
    false,
  );
  const triggers = create_triggers(source_file);

  const expecteds = create_expecteds(triggers, source_file);
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

  if (jest_config._dts_jest_debug_ === true) {
    return transformed;
  }

  const tsconfig: ts.CompilerOptions = {
    ...get_tsconfig(default_to(jest_config.globals._dts_jest_, {})),
    inlineSourceMap: true,
  };
  return ts.transpile(transformed, tsconfig, source_filename);
};
