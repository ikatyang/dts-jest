import pretty_format = require('pretty-format');
import { runtime_indent_spaces, ActualResult } from './definitions';
import { indent } from './utils/indent';
import { safe_snapshot } from './utils/safe-snapshot';

export class ActualRuntime {
  public results: { [line: number]: ActualResult };

  constructor(results: { [line: number]: ActualResult }) {
    this.results = results;
  }

  public report(line: number, getter: () => any) {
    const result = this.results[line];
    const description =
      result.description === undefined ? '' : `\n${result.description}\n`;

    const expression = indent(result.expression, runtime_indent_spaces);
    const actual_value = indent(
      safe_snapshot(getter, pretty_format),
      runtime_indent_spaces,
    );

    return `${description}\nEvaluated\n\n${expression}\n\nto be\n\n${actual_value}\n`;
  }
}
