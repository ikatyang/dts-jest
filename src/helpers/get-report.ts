import {indent} from '../utils/indent';

// tslint:disable:no-magic-numbers

export const get_report = (reporter_template: string, expression: string, snapshot: string) =>
  reporter_template
    .split(/\{\{(expression|snapshot),([0-9]+)\}\}/g)
    .map((chunk, index, chunks) =>
      (index % 3 === 0)
          ? chunk
          : (index % 3 === 1)
            ? ''
            : (chunks[index - 1] === 'snapshot')
              ? indent(snapshot, +chunk)
              : indent(expression, +chunk),
    )
    .join('');
