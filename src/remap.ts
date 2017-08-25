import * as jest_snapshot_parser from 'jest-snapshot-parser';
import * as _ts from 'typescript';
import { AssertionFlag, TestMethod, Trigger } from './definitions';
import { create_triggers } from './utils/create-triggers';
import { default_to } from './utils/default-to';
import { get_formatted_description } from './utils/get-formatted-description';
import { skipify_triggers_method } from './utils/skipify-triggers-method';

// tslint:disable-next-line:no-duplicate-imports no-unused-variable
import { Parsed } from 'jest-snapshot-parser';

export interface RemapOptions {
  typescript?: typeof _ts;
  source_filename?: string;
}

export const remap = (
  source_content: string,
  snapshot_content: string | jest_snapshot_parser.Parsed,
  // istanbul ignore next
  options: RemapOptions = {},
) => {
  const { typescript: ts = _ts, source_filename = '' } = options;

  const parsed_snapshot =
    typeof snapshot_content === 'string'
      ? jest_snapshot_parser.parse(snapshot_content)
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

      if (!(title in parsed_snapshot)) {
        throw new Error(`Unmatched snapshot title \`${title}\``);
      }

      const snapshot_value = parsed_snapshot[title];

      if (typeof snapshot_value !== 'string') {
        throw new Error(
          `Snapshot value should be a string, but got ${JSON.stringify(
            snapshot_value,
          )}`,
        );
      }

      const snapshot_value_first_line = snapshot_value.split('\n')[0];
      source_line_contents[trigger.line] += ` -> ${snapshot_value_first_line}`;
    });

  return source_line_contents.join('\n');

  function get_increased_counter(title: string) {
    const counter = default_to<number>(counters[title], 0) + 1;
    counters[title] = counter;
    return counter;
  }
};

function get_snapshot_base_title(trigger: Trigger) {
  const title = get_formatted_description(trigger, false);
  return trigger.group !== undefined
    ? `${trigger.group.title} ${title}`
    : title;
}
