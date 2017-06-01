import * as path from 'path';
import * as tsconfig_extends from 'tsconfig-extends';
import * as ts from 'typescript';
import * as yargs from 'yargs';
import {jest_root_dir_placeholder, JestConfig, JestGlobalConfig, RawConfig} from './definitions';
import {defaults} from './utils';

// tslint:disable:no-require-imports no-var-requires
const args = require('jest-cli/build/cli/args');
const read_config = require('jest-config').readConfig;
// tslint:enable:no-require-imports no-var-requires

export const get_jest_configs = (argv: string[]): {config: JestConfig, globalConfig: JestGlobalConfig} => {
  // https://github.com/facebook/jest/blob/master/packages/jest-cli/src/cli/index.js
  const parsed = yargs(argv).options(args.options);
  const project = process.cwd();

  // https://github.com/facebook/jest/blob/master/packages/jest-config/src/index.js
  return read_config(parsed.argv, project);
};

export const get_raw_config = (jest_config: JestConfig): RawConfig =>
  defaults(jest_config.globals._dts_jest_, {});

export const get_server_port_from_raw_config = (raw_config: RawConfig) =>
  defaults(raw_config.server_port, 10086);

export const get_server_port = (jest_config: JestConfig) =>
  get_server_port_from_raw_config(get_raw_config(jest_config));

export const get_debug = (jest_config: JestConfig) =>
  defaults(get_raw_config(jest_config).debug, false);

export const get_tsconfig = (jest_config: JestConfig): ts.CompilerOptions => {
  const raw_tsconfig = defaults(
    get_raw_config(jest_config).tsconfig,
    path.join(jest_config.rootDir, 'tsconfig.json'),
  );
  return (typeof raw_tsconfig === 'string')
    ? tsconfig_extends.load_file_sync(raw_tsconfig.replace(jest_root_dir_placeholder, jest_config.rootDir))
    : raw_tsconfig;
};
