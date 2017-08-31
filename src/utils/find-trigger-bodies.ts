import * as _ts from 'typescript';
import { TriggerBody, TriggerGroup, TriggerHeader } from '../definitions';
import { create_message } from './create-message';
import { get_display_line } from './get-display-line';
import { get_node_one_line_text } from './get-node-one-line-text';
import { get_trigger_groups } from './get-trigger-groups';
import { get_trigger_header_line } from './get-trigger-line';
import { traverse_node } from './traverse-node';

export const find_trigger_bodies = (
  source_file: _ts.SourceFile,
  headers: TriggerHeader[],
  ts: typeof _ts,
) => {
  const bodies: TriggerBody[] = [];

  const header_map = new Map<number, TriggerHeader>();
  headers.forEach(header => header_map.set(header.line, header));

  const groups = get_trigger_groups(headers);
  const invalid_groups: TriggerGroup[] = [];

  traverse_node(
    source_file,
    node => {
      const start = node.getStart();
      const end = node.getEnd();

      const body_line = source_file.getLineAndCharacterOfPosition(start).line;
      const body_end_line = source_file.getLineAndCharacterOfPosition(end).line;

      // check if group position is valid (top-level comment)
      if (groups.length !== 0) {
        const [first_group] = groups;

        if (first_group.line < body_line) {
          // checked
          groups.shift();
        } else if (
          // group is not at the top-level (surrounded by node)
          first_group.line >= body_line &&
          first_group.line <= body_end_line
        ) {
          invalid_groups.push(groups.shift()!);
        }
      }

      const header_line = get_trigger_header_line(body_line);

      if (
        node.kind <= ts.SyntaxKind.LastTriviaToken ||
        !header_map.has(header_line)
      ) {
        return;
      }

      header_map.delete(header_line);

      bodies.push({
        start,
        end,
        experssion: get_node_one_line_text(node, source_file, ts),
        text: get_dedented_expression_text(node, source_file)
          // remove trailing semicolons and spaces
          .replace(/\s*;*\s*$/, ''),
      });
    },
    ts,
  );

  // unattachable_lines
  if (header_map.size !== 0) {
    const unattachable_line_infos: string[] = [];
    header_map.forEach((header, line) => {
      const { description = '' } = header;
      unattachable_line_infos.push(
        `${source_file.fileName}:${get_display_line(line)} ${description}`,
      );
    });
    throw new Error(
      create_message(
        'Unattachable trigger(s) detected:',
        unattachable_line_infos,
      ),
    );
  }

  if (invalid_groups.length !== 0) {
    throw new Error(
      create_message(
        'Invalid trigger-group(s) detected:',
        invalid_groups.map(
          ({ line, description = '' }) =>
            `${source_file.fileName}:${get_display_line(line)} ${description}`,
        ),
      ),
    );
  }

  return bodies;
};

function get_dedented_expression_text(
  node: _ts.Node,
  source_file: _ts.SourceFile,
) {
  const start = node.getStart();
  const { character } = source_file.getLineAndCharacterOfPosition(start);

  return (
    node
      .getText(source_file)
      // dedent
      .replace(/^ */gm, spaces =>
        ' '.repeat(Math.max(0, spaces.length - character)),
      )
  );
}
