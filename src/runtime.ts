import {Result} from './definitions';
import {indent} from './utils/indent';

export class Runtime {

  public results: {[line: number]: Result};

  constructor(results: {[line: number]: Result}) {
    this.results = results;
  }

  public snapshot(line: number) {
    if (this.results[line].diagnostic !== undefined) {
      throw new Error(this.results[line].diagnostic);
    }
    return this.results[line].inference!;
  }

  public safe_snapshot(line: number) {
    try {
      return this.snapshot(line);
    } catch (error) {
      return (error as Error).message;
    }
  }

  public report(line: number) {
    const result = this.results[line];
    const description = (result.description === undefined)
      ? ''
      : `\n${result.description}\n`;
    return `${description}\nInferred\n\n${
      indent(result.expression, 2)
    }\n\nto be\n\n${
      indent(this.safe_snapshot(line), 2)
    }\n`;
  }

}
