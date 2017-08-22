import * as path from 'path';
import { config_namespace, JestConfig } from './definitions';
import { get_config } from './utils/get-config';

export class Reporter implements jest.Reporter {
  public global_config: jest.GlobalConfig;

  constructor(global_config: jest.GlobalConfig) {
    this.global_config = global_config;
  }

  // tslint:disable-next-line:naming-convention prefer-function-over-method
  public onRunComplete(contexts: Set<jest.Context>) {
    // istanbul ignore next
    const write_stream = this.global_config.useStderr
      ? process.stderr
      : process.stdout;

    write_stream.write('\n');

    contexts.forEach(context => {
      const {
        typescript: { version: ts_version },
        typescript_path: ts_path,
      } = get_config(
        (context.config as JestConfig).globals[config_namespace],
        context.config.rootDir,
      );

      // istanbul ignore next
      const context_name =
        contexts.size > 1 ? ` ${path.basename(context.config.rootDir)}` : '';

      write_stream.write(
        `[dts-jest]${context_name} using TypeScript v${ts_version} from ${ts_path}\n`,
      );
    });

    write_stream.write('\n');
  }
}
