import * as ts from 'typescript';
import { Snapshot } from '../definitions';
import { traverse_node } from './traverse-node';

export const create_snapshots = (
  program: ts.Program,
  source_filename: string,
  lines: number[],
  flag: ts.TypeFormatFlags,
) => {
  const source_file = program.getSourceFile(source_filename);
  const snapshots: { [line: number]: Snapshot } = {};

  const rest_lines = lines.slice();

  const diagnostics = ts.getPreEmitDiagnostics(program, source_file);
  for (const diagnostic of diagnostics) {
    // tslint:disable-next-line:no-unnecessary-type-assertion
    const position = diagnostic.start!;
    const { line: error_line } = source_file.getLineAndCharacterOfPosition(
      position,
    );
    const trigger_line = error_line - 1;

    const line_index = rest_lines.indexOf(trigger_line);
    if (line_index !== -1) {
      snapshots[trigger_line] = {
        diagnostic: ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          '\n',
        ),
      };
      rest_lines.splice(line_index, 1);
    }
  }

  const checker = program.getTypeChecker();
  traverse_node(source_file, node => {
    const position = node.getStart(source_file);
    const { line: expression_line } = source_file.getLineAndCharacterOfPosition(
      position,
    );
    const trigger_line = expression_line - 1;

    const line_index = rest_lines.indexOf(trigger_line);
    if (line_index !== -1) {
      const target_node = node.getChildAt(0);
      const type = checker.getTypeAtLocation(target_node);
      snapshots[trigger_line] = {
        inference: checker.typeToString(type, node, flag),
      };
      rest_lines.splice(line_index, 1);
    }
  });

  return snapshots;
};
