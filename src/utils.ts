import * as request from 'request';
import * as ts from 'typescript';
import {Snapshots} from './definitions';
import {ServerPage} from './server';

export const traverse_node = (node: ts.Node, callback: (node: ts.Node) => void) => {
  if (node.kind !== ts.SyntaxKind.SourceFile) {
    callback(node);
  }
  ts.forEachChild(node, child => traverse_node(child, callback));
};

export const remove_spaces = (text: string) =>
  text.replace(/^\s+|\s+$|\n/mg, '');

export const defaults = <T>(value: undefined | T, default_value: T): T =>
  (value === undefined)
    ? default_value
    : value;

export const request_server = (port: number, page: ServerPage, args?: {}, callback?: (body: string) => void) => {
  const url = `http://127.0.0.1:${port}${page}`;
  return request.get(
    url,
    {
      qs: args,
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        throw new Error(`Error: url=${url} args=${args} -> ${
          error
            ? error
            : `status=${response.statusCode}`
        }`);
      } else if (callback) {
        callback(body);
      }
    },
  );
};

export const get_snapshots = (program: ts.Program, source_filename: string, lines: number[]) => {
  const source_file = program.getSourceFile(source_filename);
  const snapshots: Snapshots = {};

  const rest_lines = lines.slice();

  const diagnostics = ts.getPreEmitDiagnostics(program, source_file);
  for (const diagnostic of diagnostics) {
    // tslint:disable-next-line:no-unnecessary-type-assertion
    const position = diagnostic.start!;
    const {line: error_line} = source_file.getLineAndCharacterOfPosition(position);
    const trigger_line = error_line - 1;

    const line_index = rest_lines.indexOf(trigger_line);
    if (line_index !== -1) {
      snapshots[trigger_line] = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      rest_lines.splice(line_index, 1);
    }
  }

  const checker = program.getTypeChecker();
  traverse_node(source_file, node => {
    const position = node.getStart(source_file);
    const {line: expression_line} = source_file.getLineAndCharacterOfPosition(position);
    const trigger_line = expression_line - 1;

    const line_index = rest_lines.indexOf(trigger_line);
    if (line_index !== -1) {
      const target_node = node.getChildAt(0);
      const type = checker.getTypeAtLocation(target_node);
      snapshots[trigger_line] = checker.typeToString(type, node, ts.TypeFormatFlags.NoTruncation);
      rest_lines.splice(line_index, 1);
    }
  });

  return snapshots;
};
