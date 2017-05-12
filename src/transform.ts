import {ITrigger, ITSConfig, TriggerKind} from './definitions';
import {ISetupOptions} from './setup';

// tslint:disable-next-line:no-require-imports no-var-requires
const package_json = require('../package.json');

export interface ITransformOptions {
  tsconfig: ITSConfig;
  source_text: string;
  source_filename: string;
}

const dedent = (str: string) => {
  // tslint:disable-next-line:no-non-null-assertion
  const [, indent] = str.match(/\n( +)/)!;
  return str.trim().replace(new RegExp(`^${indent}`, 'mg'), '');
};

export const transform = (options: ITransformOptions) => {
  const {
    tsconfig,
    source_text,
    source_filename,
  } = options;

  const breakline_indexes: number[] = [];
  {
    const regex = /\n/g;
    for (let results = regex.exec(source_text); results !== null; results = regex.exec(source_text)) {
      breakline_indexes.push(results.index);
    }
  }

  let current_line = 0;

  const triggers: ITrigger[] = [];
  {
    const regex = /\/\/ @dts-jest(?::(skip|only|show))?[ \t]*([^\n]*)?\s*\n[ \t]*([^;]+);/g;
    for (let results = regex.exec(source_text); results !== null; results = regex.exec(source_text)) {
      const [, raw_kind, description, test_code] = results;
      const {index} = results;

      while (index > breakline_indexes[0]) {
        current_line++;
        breakline_indexes.shift();
      }

      triggers.push({
        line: current_line,
        kind: (raw_kind === 'skip')
          ? TriggerKind.Skip
          : (raw_kind === 'only')
            ? TriggerKind.Only
            : (raw_kind === 'show')
              ? TriggerKind.Show
              : TriggerKind.None,
        description: (
          ((description as string | undefined) !== undefined)
            ? description.trim()
            : test_code
        ).replace(/\n/g, '\n    '),
      });
    }
  }

  const namespace = '_dts_jest_';

  const setup_options: ISetupOptions = {
    tsconfig,
    triggers,
    source_filename,
  };

  const setup_string = JSON.stringify(setup_options, null, '  ');
  const setup = `var ${namespace} = require(${JSON.stringify(package_json.name)}).setup(${setup_string});`;

  const test_cases = triggers.map(trigger => {
    const {kind, description, line} = trigger;
    const test = (kind === TriggerKind.Skip)
      ? 'test.skip'
      : (kind === TriggerKind.Only)
        ? 'test.only'
        : 'test';
    return dedent(`
      ${test}(${JSON.stringify(description)}, function () {
        ${
          (kind === TriggerKind.Show)
            ? `console.log(${namespace}(${JSON.stringify(line)}));`
            : `expect(${namespace}(${JSON.stringify(line)})).toMatchSnapshot();`
        }
      });
    `);
  });

  return `${setup}\n${test_cases.join('\n')}`;
};
