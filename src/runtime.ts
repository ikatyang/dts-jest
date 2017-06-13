import {Results} from './definitions';
import {indent} from './utils/indent';

export class Runtime {

  public results: Results;

  constructor(results: Results) {
    this.results = results;
  }

  public snapshot(line: number) {
    return this.results[line].snapshot;
  }

  public report(line: number) {
    const result = this.results[line];
    const description = (result.description === undefined)
      ? ''
      : `\n${result.description}\n`;
    return `${description}\nInferred\n\n${indent(result.expression, 2)}\n\nto be\n\n${indent(result.snapshot, 2)}\n`;
  }

}
