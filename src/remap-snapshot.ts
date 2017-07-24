import * as ts from 'typescript';
import { Trigger } from './definitions';
import { create_triggers } from './utils/create-triggers';
import { default_to } from './utils/default-to';
import { get_formatted_description } from './utils/get-formatted-description';

// tslint:disable-next-line:no-require-imports no-var-requires
const require_from_string = require('require-from-string');

export const remap_snapshot = (
  snapshot_content: string | Record<string, string>,
  source_content: string,
  snapshot_filename?: string,
) => {
  const snapshot_data =
    typeof snapshot_content === 'string'
      ? require_from_string(snapshot_content, snapshot_filename) as Record<
          string,
          string
        >
      : snapshot_content;

  const source_file = ts.createSourceFile(
    '',
    source_content,
    ts.ScriptTarget.Latest,
    false,
  );
  const triggers = create_triggers(source_file);

  const source_content_lines = source_content.split('\n');

  const counters: Record<string, number> = {};
  triggers.forEach(trigger => {
    const title = get_snapshot_title(trigger);
    const counter = (counters[title] =
      default_to<number>(counters[title], 0) + 1);

    const description = `${title} ${counter}`;

    if (!(description in snapshot_data)) {
      return;
    }

    const { line } = trigger;
    let snapshot = snapshot_data[description].trim();
    const breakline = snapshot.indexOf('\n');
    if (breakline !== -1) {
      snapshot = `"${snapshot.slice(1, breakline)}"`;
    }
    source_content_lines[line] += ` -> ${JSON.parse(snapshot)}`;
  });

  return source_content_lines.join('\n');
};

function get_snapshot_title(trigger: Trigger) {
  let title = get_formatted_description(trigger, false);
  if (trigger.group !== undefined) {
    title = `${trigger.group.title} ${title}`;
  }
  return title;
}
