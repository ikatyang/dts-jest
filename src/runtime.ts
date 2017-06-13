import {Expressions, Snapshots} from './definitions';
import {indent} from './utils/indent';

export class Runtime {

  public snapshots: Snapshots;
  public expressions: Expressions;

  constructor(expressions: Expressions, snapshots: Snapshots) {
    this.expressions = expressions;
    this.snapshots = snapshots;
  }

  public snapshot(line: number) {
    return this.snapshots[line];
  }

  public report(line: number) {
    return `\nInferred\n\n${indent(this.expressions[line], 2)}\n\nto be\n\n${indent(this.snapshots[line], 2)}\n`;
  }

}
