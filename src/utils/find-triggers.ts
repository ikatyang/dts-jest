import * as _ts from 'typescript';
import { Trigger, TriggerFooter } from '../definitions';
import { find_trigger_bodies } from './find-trigger-bodies';
import { find_trigger_footers } from './find-trigger-footers';
import { find_trigger_headers } from './find-trigger-headers';
import { get_trigger_body_end_line } from './get-trigger-line';

export const find_triggers = (source_file: _ts.SourceFile, ts: typeof _ts) => {
  const triggers: Trigger[] = [];

  const headers = find_trigger_headers(source_file, ts);
  const bodies = find_trigger_bodies(source_file, headers, ts);
  const footers = find_trigger_footers(source_file, bodies, ts);

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const body = bodies[i];
    let footer: TriggerFooter | undefined;

    const { line: body_end_line } = source_file.getLineAndCharacterOfPosition(
      body.end,
    );

    if (
      footers.length !== 0 &&
      body_end_line === get_trigger_body_end_line(footers[0].line)
    ) {
      footer = footers.shift();
    }

    triggers.push({
      header,
      body,
      footer,
    });
  }

  return triggers;
};
