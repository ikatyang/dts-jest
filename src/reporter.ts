import * as path from 'path';
import { config_namespace, JestConfig } from './definitions';
import { get_config } from './utils/get-config';

export class Reporter implements jest.Reporter {
  // tslint:disable-next-line:naming-convention prefer-function-over-method
  public onRunComplete(contexts: Set<jest.Context>) {
    process.stdout.write('\n');

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

      process.stdout.write(
        `[dts-jest]${context_name} using TypeScript v${ts_version} from ${ts_path}\n`,
      );
    });

    process.stdout.write('\n');
  }
}
