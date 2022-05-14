import * as JestTypes from '@jest/types';
import * as JestReporters from '@jest/reporters';
import * as path from 'path';
import { config_namespace, JestConfig } from './definitions';
import { create_typescript_info } from './utils/create-typescript-info';
import { normalize_config } from './utils/normalize-config';

export class Reporter implements JestReporters.Reporter {
  constructor(public global_config: JestTypes.Config.GlobalConfig) {}

  // istanbul ignore next
  public onRunStart() {}

  // istanbul ignore next
  public getLastError() {}

  public onRunComplete(contexts: Set<JestReporters.TestContext>) {
    // istanbul ignore next
    const write_stream = this.global_config.useStderr
      ? process.stderr
      : process.stdout;

    write_stream.write('\n');

    contexts.forEach(context => {
      const { typescript: ts, typescript_path } = normalize_config(
        (context.config as JestConfig).globals[config_namespace],
      );

      // istanbul ignore next
      const context_name =
        contexts.size > 1 ? ` ${path.basename(context.config.rootDir)}: ` : ' ';

      const typescript_info = create_typescript_info(
        ts.version,
        typescript_path,
        false,
      );
      write_stream.write(`[dts-jest]${context_name}${typescript_info}\n`);
    });

    write_stream.write('\n');
  }
}
