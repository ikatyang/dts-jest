import * as _ts from 'typescript';
import {
  NormalizedConfig,
  Snapshot,
  Trigger,
  TriggerHeaderFlags,
} from '../definitions';
import { create_message } from './create-message';
import { get_diagnostic_message } from './get-diagnostic-message';
import { get_display_line } from './get-display-line';
import { get_trigger_body_line } from './get-trigger-line';
import { traverse_node } from './traverse-node';

export const create_snapshots = (
  filename: string,
  triggers: Trigger[],
  normalized_config: NormalizedConfig,
) => {
  const {
    typescript: ts,
    compiler_options,
    enclosing_declaration,
    type_format_flags,
  } = normalized_config;

  const program = ts.createProgram([filename], compiler_options);
  const source_file = program.getSourceFile(filename);

  const body_line_map = new Map<number, Trigger>();
  triggers.forEach(trigger => {
    if (trigger.header.flags & TriggerHeaderFlags.Assertion) {
      const body_line = get_trigger_body_line(trigger.header.line);
      body_line_map.set(body_line, trigger);
    }
  });

  interface UnmatchedDiagnostic {
    line: number;
    message: string;
  }
  const unmatched_diagnostics: UnmatchedDiagnostic[] = [];

  const snapshots: Snapshot[] = [];

  const diagnostics = ts.getPreEmitDiagnostics(program, source_file);
  for (const diagnostic of diagnostics) {
    const position = diagnostic.start!;
    const { line } = source_file.getLineAndCharacterOfPosition(position);

    if (!body_line_map.has(line)) {
      unmatched_diagnostics.push({
        line,
        message: get_diagnostic_message(diagnostic),
      });
      continue;
    }

    snapshots.push({
      line,
      diagnostic: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    });

    body_line_map.delete(line);
  }

  if (unmatched_diagnostics.length !== 0) {
    throw new Error(
      create_message(
        'Unmatched diagnostic(s) detected:',
        unmatched_diagnostics.map(
          ({ line, message }) =>
            `${source_file.fileName}:${get_display_line(line)} ${message}`,
        ),
      ),
    );
  }

  if (body_line_map.size === 0) {
    return snapshots;
  }

  const checker = program.getTypeChecker();
  traverse_node(
    source_file,
    node => {
      const position = node.getStart();
      const { line } = source_file.getLineAndCharacterOfPosition(position);

      if (!body_line_map.has(line)) {
        return;
      }

      const target_node = node.getChildAt(0);
      const type = checker.getTypeAtLocation(target_node);

      snapshots.push({
        line,
        inference: checker.typeToString(
          type,
          // istanbul ignore next
          enclosing_declaration ? node : undefined,
          type_format_flags,
        ),
      });

      body_line_map.delete(line);
    },
    ts,
  );

  return snapshots;
};
