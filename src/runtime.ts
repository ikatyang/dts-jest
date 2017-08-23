import { runtime_indent_spaces, Result } from './definitions';
import { indent } from './utils/indent';
import { safe_snapshot } from './utils/safe-snapshot';

export class Runtime {
  public results: { [line: number]: Result };

  constructor(results: { [line: number]: Result }) {
    this.results = results;
  }

  public snapshot(line: number) {
    if (this.results[line].diagnostic !== undefined) {
      throw new Error(this.results[line].diagnostic);
    }
    return this.results[line].inference!;
  }

  public safe_snapshot(line: number) {
    return safe_snapshot(() => this.snapshot(line));
  }

  public report(line: number) {
    const result = this.results[line];
    const description =
      result.description === undefined ? '' : `\n${result.description}\n`;

    const expression = indent(result.expression, runtime_indent_spaces);
    const snapshot = indent(this.safe_snapshot(line), runtime_indent_spaces);

    return `${description}\nInferred\n\n${expression}\n\nto be\n\n${snapshot}\n`;
  }
}
