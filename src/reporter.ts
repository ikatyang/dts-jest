import * as micromatch from 'micromatch';
import {get_jest_configs, get_server_port} from './config';
import {transformer_filename, JestConfig, JestGlobalConfig} from './definitions';
import {Server} from './server';

// tslint:disable-next-line:no-require-imports no-var-requires
const find_down = require('vfile-find-down');

let counter = 0;

export class Reporter {

  public config: JestConfig;
  public global_config: JestGlobalConfig;
  public port: number;

  constructor(global_config: JestGlobalConfig, _options: any) {
    const {config} = get_jest_configs(process.argv.slice(2));
    this.port = get_server_port(config);
    this.config = config;
    this.global_config = global_config;

    if (global_config.watch && counter++ === 0) {
      let server_pid: number | undefined;
      let exiting = false;

      const exit = () => {
        process.kill(server_pid!);
        process.exit();
      };

      Server.request_pid(this.port, pid => {
        server_pid = pid;
        if (exiting) {
          exit();
        }
      });

      process.on('exit', () => {
        if (server_pid === undefined) {
          exiting = true;
        } else {
          exit();
        }
      });
    }
  }

  public onRunStart() {
    Server.request_reset_mark(this.port);
    this.get_filenames(filenames => {
      Server.request_reset_start(this.port, filenames);
    });
  }

  public onRunComplete() {
    if (!this.global_config.watch) {
      Server.request_close(this.port);
    }
  }

  public get_filenames(callback: (filenames: string[]) => void) {
    const test_ignore_matcher = create_ignore_matcher(this.config.testPathIgnorePatterns);
    const test_matcher = (this.config.testRegex !== undefined)
      ? (filename: string) => create_matcher_regex(this.config.testRegex!).test(filename)
      : (filename: string) => micromatch.any(filename, this.config.testMatch);
    const transform_ignore_matcher = create_ignore_matcher(this.config.transformIgnorePatterns);
    const transform_matcher = create_transform_matcher(this.config.transform);

    interface VFile {
      path: string;
    }

    find_down.all(
      (vfile: VFile) => {
        const filename = vfile.path;
        if (test_ignore_matcher(filename)) {
          return find_down.SKIP;
        }
        if (!test_matcher(filename) || transform_ignore_matcher(filename)) {
          return false;
        }
        if (transform_matcher(filename)) {
          return true;
        }
      },
      this.config.rootDir,
      (error: any, vfiles: VFile[]) => {
        const filenames = error ? [] : vfiles.map(vfile => vfile.path);
        callback(filenames);
      },
    );
  }

}

function create_ignore_matcher(patterns: string[]) {
  const pattern = patterns.join('|');
  const regex = create_matcher_regex(pattern);
  return (pattern === '')
    ? () => false
    : (filename: string) => regex.test(filename);
}

function create_transform_matcher(transform: JestConfig['transform']) {
  const transform_pattern = Object.keys(transform).filter(
    pattern => (transform[pattern] === transformer_filename),
  ).join('|');
  const transform_regex = create_matcher_regex(transform_pattern);
  return (filename: string) => transform_regex.test(filename);
}

function create_matcher_regex(pattern: string) {
  return new RegExp(pattern, 'i');
}
