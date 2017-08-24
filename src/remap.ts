import require_from_string = require('require-from-string');
import * as _ts from 'typescript';
import {
  AssertionFlag,
  JestSnapshot,
  TestMethod,
  Trigger,
} from './definitions';
import { create_triggers } from './utils/create-triggers';
import { default_to } from './utils/default-to';
import { get_formatted_description } from './utils/get-formatted-description';
import { skipify_triggers_method } from './utils/skipify-triggers-method';

export interface RemapOptions {
  typescript?: typeof _ts;
  source_filename?: string;
  snapshot_filename?: string;
}

export const remap = (
  source_content: string,
  snapshot_content: string | JestSnapshot,
  // istanbul ignore next
  options: RemapOptions = {},
) => {
  const {
    typescript: ts = _ts,
    source_filename = '',
    snapshot_filename = '',
  } = options;

  const jest_snapshot =
    typeof snapshot_content === 'string'
      ? require_from_string(snapshot_content, snapshot_filename) as JestSnapshot
      : snapshot_content;

  const source_file = ts.createSourceFile(
    source_filename,
    source_content,
    ts.ScriptTarget.Latest,
    false,
  );

  const triggers = create_triggers(source_file, ts);
  skipify_triggers_method(triggers);

  const source_line_contents = source_content.split('\n');

  const counters: Record<string, number> = {};
  triggers
    .filter(
      trigger =>
        trigger.flags.indexOf(AssertionFlag.Snapshot) !== -1 &&
        trigger.method !== TestMethod.Skip,
    )
    .forEach(trigger => {
      const base_title = get_snapshot_base_title(trigger);
      const counter = get_increased_counter(base_title);

      const title = `${base_title} ${counter}`;

      if (!(title in jest_snapshot)) {
        throw new Error(`Unmatched snapshot title \`${title}\``);
      }

      const snapshot_value = get_snapshot_value(jest_snapshot[title]);

      source_line_contents[trigger.line] += ` -> ${snapshot_value}`;
    });

  return source_line_contents.join('\n');

  function get_increased_counter(title: string) {
    const counter = default_to<number>(counters[title], 0) + 1;
    counters[title] = counter;
    return counter;
  }
};

/**
 * case 1 - single line string -> get entire string ("single-line")
 *
 *     exports[`description counter`] = `"single-line"`;
 *
 * case 2 - multiline string -> only get first-line string ("first-line")
 *
 *     exports[`description counter`] = `
 *     "first-line
 *     second-line
 *     third-line"
 *     `;
 */
function get_snapshot_value(snapshot: string) {
  let value = snapshot.trim();

  const breakline = value.indexOf('\n');
  if (breakline !== -1) {
    value = `"${value.slice(1, breakline)}"`;
  }

  return JSON.parse(value) as string;
}

function get_snapshot_base_title(trigger: Trigger) {
  const title = get_formatted_description(trigger, false);
  return trigger.group !== undefined
    ? `${trigger.group.title} ${title}`
    : title;
}
