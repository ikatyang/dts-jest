import * as jest_snapshot_parser from 'jest-snapshot-parser';
import * as _ts from 'typescript';
import { TestMethod, TriggerHeaderFlags } from './definitions';
import { create_source_file } from './utils/create-source-file';
import { find_triggers } from './utils/find-triggers';
import { get_snapshot_description } from './utils/get-snapshot-description';
import { normalize_trigger_header_methods } from './utils/normalize-trigger-header-methods';
import { Parsed } from 'jest-snapshot-parser';

export interface RemapOptions {
  typescript?: typeof _ts;
  source_filename?: string;
}

export const remap = (
  source_content: string,
  snapshot_content: string | jest_snapshot_parser.Parsed,
  options: RemapOptions = {},
) => {
  const { typescript: ts = _ts, source_filename = '' } = options;

  const parsed_snapshot =
    typeof snapshot_content === 'string'
      ? jest_snapshot_parser.parse(snapshot_content)
      : snapshot_content;

  const source_file = create_source_file(source_filename, source_content, ts);
  const triggers = find_triggers(source_file, ts);

  normalize_trigger_header_methods(triggers.map(trigger => trigger.header));

  const source_line_contents = source_content.split('\n');
  const counters: Record<string, number> = {};

  triggers
    .filter(
      trigger =>
        trigger.header.method === TestMethod.Test &&
        trigger.header.flags & TriggerHeaderFlags[':snap'],
    )
    .forEach(trigger => {
      const description = get_snapshot_description(trigger);
      const counter = get_increased_counter(description);
      const title = `${description} ${counter}`;

      if (!(title in parsed_snapshot)) {
        throw new Error(`Unmatched snapshot title \`${title}\``);
      }

      const snapshot_value = parsed_snapshot[title];

      if (typeof snapshot_value !== 'string') {
        const snapshot_display_value = JSON.stringify(snapshot_value);
        throw new Error(
          `Snapshot value should be a string, but got ${snapshot_display_value}`,
        );
      }

      const snapshot_value_first_line = snapshot_value.split('\n')[0];
      const { header } = trigger;

      source_line_contents[header.line] += ` -> ${snapshot_value_first_line}`;
    });

  return source_line_contents.join('\n');

  function get_increased_counter(title: string) {
    return (counters[title] = title in counters ? counters[title] + 1 : 1);
  }
};
