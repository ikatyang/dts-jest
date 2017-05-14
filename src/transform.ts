import {ISelfConfig, ITrigger, TriggerKind} from './definitions';
import {ISetupOptions} from './setup';

// tslint:disable-next-line:no-require-imports no-var-requires
const package_json = require('../package.json');

export interface ITransformOptions {
  self_config: ISelfConfig;
  source_text: string;
  source_filename: string;
}

export const transform = (options: ITransformOptions) => {
  const {
    self_config,
    source_text,
    source_filename,
  } = options;

  const {tsconfig} = self_config;

  const breaklines: number[] = [];
  {
    const regex = /\n/g;
    for (let results = regex.exec(source_text); results !== null; results = regex.exec(source_text)) {
      breaklines.push(results.index);
    }
  }

  let current_line = 0;

  const triggers: ITrigger[] = [];
  {
    const breakline_indexes = breaklines.slice();
    const regex = /\/\/ @dts-jest(?::(skip|only|show))?[ \t]*([^\n]*)?\s*\n[ \t]*([^;]+);/g;
    for (let results = regex.exec(source_text); results !== null; results = regex.exec(source_text)) {
      const [, raw_kind, description, expression] = results;
      const {index} = results;

      while (index > breakline_indexes[0]) {
        current_line++;
        breakline_indexes.shift();
      }

      triggers.push({
        expression,
        description,
        line: current_line,
        kind: (raw_kind === 'skip')
          ? TriggerKind.Skip
          : (raw_kind === 'only')
            ? TriggerKind.Only
            : (raw_kind === 'show')
              ? TriggerKind.Show
              : TriggerKind.None,
      });
    }
  }

  const namespace = '_dts_jest_runtime_';
  const fn_indent = `${namespace}.indent`;
  const fn_snapshot = `${namespace}.snapshot`;

  // tslint:disable:no-magic-numbers restrict-plus-operands
  const stringified_empty_string = JSON.stringify('');
  const generate_stringified_reporter_message = (stringified_expression: string, stringified_line: string) =>
    self_config.reporter_template
      .split(/\{\{(expression|type),([0-9]+)\}\}/g)
      .map((chunk, index, chunks) =>
        (index % 3 === 0)
          ? JSON.stringify(chunk)
          : (index % 3 === 2)
            ? stringified_empty_string
            : (chunk === 'type')
              ? `${fn_indent}(${fn_snapshot}(${stringified_line}), ${chunks[index + 1]})`
              : `${fn_indent}(${stringified_expression}, ${chunks[index + 1]})`,
      )
      .filter(chunk => chunk !== stringified_empty_string)
      .join(' + ');
  // tslint:enable:no-magic-numbers restrict-plus-operands

  const transformed_lines = breaklines.map(() => '');

  const setup_options: ISetupOptions = {
    tsconfig,
    triggers,
    source_filename,
  };
  transformed_lines[0] =
    `var ${namespace} = require(${JSON.stringify(package_json.name)}).setup(${JSON.stringify(setup_options)});`;

  triggers.forEach(trigger => {
    const {kind} = trigger;
    const test = (kind === TriggerKind.Skip)
      ? 'test.skip'
      : (kind === TriggerKind.Only)
        ? 'test.only'
        : 'test';
    const stringified_line = JSON.stringify(trigger.line);
    const stringified_expression = JSON.stringify(trigger.expression);
    const stringified_description = JSON.stringify((
      (trigger.description !== undefined)
        ? trigger.description
        : trigger.expression
    ).replace(/\n/g, '\n    '));
    const matcher = (kind === TriggerKind.Show)
      ? `console.log(${generate_stringified_reporter_message(stringified_expression, stringified_line)});`
      : `expect(${fn_snapshot}(${stringified_line})).toMatchSnapshot();`;

    transformed_lines[trigger.line] += `${test}(${stringified_description}, function () { ${matcher} });`;
  });

  return transformed_lines.join('\n');
};
