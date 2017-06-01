import * as path from 'path';
import * as ts from 'typescript';

// tslint:disable-next-line:no-require-imports no-var-requires
export const package_name = require('../package.json').name;

export const config_namespace = '_dts_jest_';
export const runtime_namespace = '_dts_jest_runtime_';

export const transformer_filename = path.resolve(__dirname, '../transform.js');

export const trigger_regex = /^\s*\/\/\s*@dts-jest\b(:?\S*)\s*(.+)?\s*$/;
export enum TriggerMatchIndex {Input, Flag, Description}
export type TriggerMatchArray = [string, string, string | undefined];
export enum TriggerFlag {
  None = '',
  Show = ':show',
  Skip = ':skip',
  Only = ':only',
}
export interface Trigger {
  /**
   * 0-based
   */
  line: number;
  flag: TriggerFlag;
  method: TestMethod;
  expression: string;
  description?: string;
}
export type TriggerLines = number[];
export interface Snapshots {
  [line: number]: string;
}
export interface Expressions {
  [line: number]: string;
}

export enum TestMethod {
  Test = 'test',
  Skip = 'test.skip',
  Only = 'test.only',
}

export const jest_root_dir_placeholder = '<rootDir>';
export interface JestConfig {
  rootDir: string;
  testMatch: string[];
  testRegex?: string;
  testPathIgnorePatterns: string[];
  transform: {[regex: string]: string};
  transformIgnorePatterns: string[];
  globals: {
    [K in typeof config_namespace]?: RawConfig;
  };
}

export interface JestGlobalConfig {
  watch: boolean;
}

export interface RawConfig {
  tsconfig?: string | ts.CompilerOptions;
  server_port?: number;
  debug?: boolean;
}
