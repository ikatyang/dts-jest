import * as path from 'path';
import * as ts from 'typescript';
import {
  default_reporter_template,
  IRuntimeMethods,
  ISelfConfig,
  ITriggerDescriptions,
} from './definitions';
import {get_report} from './helpers/get-report';
import {load_compiler_options} from './helpers/load-compiler-options';
import {load_tsconfig} from './helpers/load-tsconfig';
import {find_index} from './utils/find-index';
import {indent} from './utils/indent';
import {indent_title} from './utils/indent-title';

export const setup = (the_module: {filename: string}, config: ISelfConfig, descriptions: ITriggerDescriptions) => {
  const {
    tsconfig: raw_tsconfig,
    // istanbul ignore next
    reporter = default_reporter_template,
  } = config;

  const tsconfig = load_tsconfig(raw_tsconfig);
  const compiler_options = load_compiler_options(tsconfig);

  const source_filename = the_module.filename;
  const source_relative_filename = path.relative(process.cwd(), source_filename);

  const program = ts.createProgram([source_filename], compiler_options);
  const source = program.getSourceFile(source_filename);
  const checker = program.getTypeChecker();
  const diagnostics = ts.getPreEmitDiagnostics(program);

  const snapshots: {[line: number]: string} = {};
  const expressions: {[line: number]: string} = {};

  const trigger_lines = Object.keys(descriptions).map(line_string => +line_string);

  const find_line =
    (expression_line: number, options: {on_success(trigger_line: number): {remove: boolean}}) => {
      const trigger_line_index =
        find_index(trigger_lines, trigger_line => (trigger_line + 1 === expression_line));
      if (trigger_line_index !== -1) {
        const trigger_line = trigger_lines[trigger_line_index];
        if (options.on_success(trigger_line).remove) {
          trigger_lines.splice(trigger_line_index, 1);
        }
      }
    };

  for (const diagnostic of diagnostics) {
    const {line: error_line} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    find_line(error_line, {on_success: trigger_line => {
      snapshots[trigger_line] = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      return {remove: false};
    }});
  }

  // tslint:disable-next-line:only-arrow-functions
  (function collect_node_data(node: ts.Node) {
    if (node.kind !== ts.SyntaxKind.SourceFile) {
      const position = node.getStart();
      const {line: node_line} = source.getLineAndCharacterOfPosition(position);
      find_line(node_line, {on_success: trigger_line => {
        try {
          const target_node = node.getChildAt(0);
          const type = checker.getTypeAtLocation(target_node);
          // tslint:disable-next-line strict-boolean-expressions
          snapshots[trigger_line] = snapshots[trigger_line] || checker.typeToString(type);
          expressions[trigger_line] = target_node.getText();
          return {remove: true};
        } catch (e) {
          // istanbul ignore next
          return {remove: false};
        }
      }});
    }
    ts.forEachChild(node, collect_node_data);
  })(source);

  if (trigger_lines.length !== 0) {
    const indentation = 2;
    const unattachable_triggers_message = trigger_lines
      // tslint:disable-next-line strict-boolean-expressions
      .map(line => `${source_relative_filename}:${line + 1} ${descriptions[line] || ''}`.trim())
      .join('\n');
    throw new Error(`Unattachable trigger(s) detected:\n\n${
      indent(unattachable_triggers_message, indentation)}`);
  }

  const jest_indentation_for_test_name = 4;

  const runtime_methods: IRuntimeMethods = {
    report: parameters =>
      get_report(reporter, expressions[parameters.line], snapshots[parameters.line]),
    snapshot: parameters =>
      snapshots[parameters.line],
    description: parameters =>
      // tslint:disable-next-line strict-boolean-expressions
      indent_title(descriptions[parameters.line] || expressions[parameters.line], jest_indentation_for_test_name),
  };

  return runtime_methods;
};
