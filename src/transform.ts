import {ITrigger, ITSConfig, TriggerKind} from './definitions';
import {ISetupOptions} from './setup';

// tslint:disable-next-line:no-require-imports no-var-requires
const package_json = require('../package.json');

export interface ITransformOptions {
  tsconfig: ITSConfig;
  source_text: string;
  source_filename: string;
}

export const transform = (options: ITransformOptions) => {
  const {
    tsconfig,
    source_text,
    source_filename,
  } = options;

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
    const line = JSON.stringify(trigger.line);
    const expression = JSON.stringify(trigger.expression);
    const description = JSON.stringify((
      (trigger.description !== undefined)
        ? trigger.description
        : trigger.expression
    ).replace(/\n/g, '\n    '));
    const matcher = (kind === TriggerKind.Show)
      // tslint:disable-next-line:max-line-length
      ? `console.log('\\nInferred\\n\\n' + ${fn_indent}(${expression}) + '\\n\\nto be\\n\\n' + ${fn_indent}(${fn_snapshot}(${line})) + '\\n');`
      : `expect(${fn_snapshot}(${line})).toMatchSnapshot();`;

    transformed_lines[trigger.line] += `${test}(${description}, function () { ${matcher} });`;
  });

  return transformed_lines.join('\n');
};
