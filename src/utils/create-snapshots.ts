import * as path from 'path';
import * as _ts from 'typescript';
import { Snapshot } from '../definitions';
import { traverse_node } from './traverse-node';

export const create_snapshots = (
  program: _ts.Program,
  source_filename: string,
  lines: number[],
  flag: _ts.TypeFormatFlags,
  ts: typeof _ts,
) => {
  const source_file = program.getSourceFile(source_filename);
  const snapshots: { [line: number]: Snapshot } = {};

  const rest_lines = lines.slice();

  const unmatched_diagnostics: {
    line: number;
    content: string;
  }[] = [];

  const diagnostics = ts.getPreEmitDiagnostics(program, source_file);
  for (const diagnostic of diagnostics) {
    const position = diagnostic.start!;
    const { line: error_line } = source_file.getLineAndCharacterOfPosition(
      position,
    );
    const trigger_line = error_line - 1;

    const line_index = rest_lines.indexOf(trigger_line);
    if (line_index === -1) {
      unmatched_diagnostics.push({
        line: error_line,
        content: ts
          .flattenDiagnosticMessageText(diagnostic.messageText, '\n')
          .split('\n')[0],
      });
      continue;
    }
    snapshots[trigger_line] = {
      diagnostic: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    };
    rest_lines.splice(line_index, 1);
  }

  if (unmatched_diagnostics.length > 0) {
    const relative_filename = path.relative(
      process.cwd(),
      source_file.fileName,
    );
    throw new Error(
      `Unmatched diagnostic(s) detected:\n\n${unmatched_diagnostics
        .map(
          ({ line, content }) =>
            `  ${relative_filename}:${line + 1} ${content}`,
        )
        .join('\n')
        .replace(/\s+$/gm, '')}`,
    );
  }

  const checker = program.getTypeChecker();
  traverse_node(
    source_file,
    node => {
      const position = node.getStart(source_file);
      const {
        line: expression_line,
      } = source_file.getLineAndCharacterOfPosition(position);
      const trigger_line = expression_line - 1;

      const line_index = rest_lines.indexOf(trigger_line);
      if (line_index === -1) {
        return;
      }

      const target_node = node.getChildAt(0);
      const type = checker.getTypeAtLocation(target_node);
      snapshots[trigger_line] = {
        inference: checker.typeToString(type, node, flag),
      };
      rest_lines.splice(line_index, 1);
    },
    ts,
  );

  return snapshots;
};
