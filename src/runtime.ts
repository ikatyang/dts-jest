import {get_server_port_from_raw_config} from './config';
import {Expressions, RawConfig, Snapshots} from './definitions';
import {Server} from './server';

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

export const create_runtime = (
    the_module: {filename: string},
    config: RawConfig,
    expressions: Expressions,
    callback: (runtime: Runtime) => void) => {
  const port = get_server_port_from_raw_config(config);
  const {filename} = the_module;
  const trigger_lines = Object.keys(expressions).map(line_str => +line_str);
  Server.request_snapshots(port, filename, trigger_lines, snapshots => {
    callback(new Runtime(expressions, snapshots));
  });
};

function indent(str: string, spaces: number) {
  let indentation = '';
  for (let i = 0; i < spaces; i++) {
    indentation += ' ';
  }
  return str.replace(/^/mg, indentation);
}
