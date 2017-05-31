import * as path from 'path';
import * as ts from 'typescript';
import {
  runtime_namespace,
  trigger_regex,
  TestMethod,
  Trigger,
  TriggerDescriptions,
  TriggerFlag,
  TriggerMatchArray,
  TriggerMatchIndex,
} from './definitions';

// tslint:disable-next-line:no-require-imports no-var-requires
const package_name = require('../package.json').name;

export const transform = (source_text: string, source_filename: string, _jest_config?: any) => {
  const source_file = ts.createSourceFile(source_filename, source_text, ts.ScriptTarget.Latest, false);

  const triggers = create_triggers(source_file);
  const trigger_lines = triggers.map(trigger => trigger.line);

  return triggers.reduce<string[]>(
    (transformed_line_texts, trigger) => {
      transformed_line_texts[trigger.line] += `${create_test_expression(trigger)};`;
      return transformed_line_texts;
    },
    source_text.split('\n').map((_, index) => (index !== 0) ? '' : `${create_setup_expression(trigger_lines)};`),
  ).join('\n');
};

function get_flag_and_method(flag: string): {flag: TriggerFlag, method: TestMethod} {
  switch (flag) {
    case TriggerFlag.None:
    case TriggerFlag.Show:
      return {flag, method: TestMethod.Test};
    case TriggerFlag.Skip:
      return {flag, method: TestMethod.Skip};
    case TriggerFlag.Only:
      return {flag, method: TestMethod.Only};
    default:
      throw new Error(`Unexpected flag ${JSON.stringify(flag)}`);
  }
}

function create_triggers(source_file: ts.SourceFile): Trigger[] {
  const source_text = source_file.getFullText();
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, source_text);

  type PartialTrigger = Pick<Trigger, 'flag' | 'method' | 'description'>;
  const partial_triggers: {[line: number]: PartialTrigger} = {};

  while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
    const token = scanner.getToken();
    if (token === ts.SyntaxKind.SingleLineCommentTrivia) {
      const comment = scanner.getTokenText();
      const match = comment.match(trigger_regex);
      if (match !== null) {
        const trigger_match = match as TriggerMatchArray;

        const {flag, method} = get_flag_and_method(trigger_match[TriggerMatchIndex.Flag]);
        const description = trigger_match[TriggerMatchIndex.Description];

        const position = scanner.getTokenPos();
        const {line} = source_file.getLineAndCharacterOfPosition(position);

        partial_triggers[line] = {
          flag,
          method,
          description,
        };
      }
    }
  }

  const triggers: Trigger[] = [];

  traverse_node(source_file, node => {
    const position = node.getStart(source_file);
    const {line: expression_line} = source_file.getLineAndCharacterOfPosition(position);
    const trigger_line = expression_line - 1;

    if (trigger_line in partial_triggers) {
      try {
        const expression = node.getText(source_file);

        const partial_trigger = partial_triggers[trigger_line];
        delete partial_triggers[trigger_line];

        triggers.push({
          expression,
          line: trigger_line,
          ...partial_trigger,
        });
      } catch (e) {
        // do nothing
      }
    }
  });

  const unattachable_lines = Object.keys(partial_triggers).map(str => +str);
  if (unattachable_lines.length !== 0) {
    const relative_filename = path.relative(process.cwd(), source_file.fileName);
    throw new Error(`Unattachable trigger(s) detected:\n\n${
      unattachable_lines
        .map(line => `  ${relative_filename}:${line + 1} ${partial_triggers[line].description || ''}`)
        .join('\n')
        .replace(/\s+$/mg, '')
    }`);
  }

  return triggers;
}

function traverse_node(node: ts.Node, callback: (node: ts.Node) => void) {
  if (node.kind !== ts.SyntaxKind.SourceFile) {
    callback(node);
  }
  ts.forEachChild(node, child => traverse_node(child, callback));
}

function create_setup_expression(trigger_lines: number[]) {
  const stringify_package_name = JSON.stringify(package_name);
  const stringify_trigger_lines = JSON.stringify(trigger_lines);
  return remove_spaces(`
    var ${runtime_namespace};
    beforeAll(function (done) {
      require(${stringify_package_name}).setup(module.filename, ${stringify_trigger_lines}, function () {
        ${runtime_namespace} = arguments[0];
        done();
      });
    })
  `);
}

function create_test_expression(trigger: Trigger) {
  const stringify_description = JSON.stringify(trigger.description || trigger.expression);
  const snapshot_expression = `${runtime_namespace}.snapshot(${trigger.line})`;
  const assertion_expression = (trigger.flag === TriggerFlag.Show)
    ? `console.log(${snapshot_expression})`
    : `expect(${snapshot_expression}).toMatchSnapshot()`;
  return remove_spaces(`
    ${trigger.method}(${stringify_description}, function () {
      ${assertion_expression};
    })
  `);
}

function remove_spaces(text: string) {
  return text.replace(/^\s+|\s+$|\n/mg, '');
}
