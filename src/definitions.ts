import * as ts from 'typescript';

// tslint:disable-next-line:no-require-imports no-var-requires
export const package_name = require('../package.json').name;

export const config_namespace = '_dts_jest_';
export const runtime_namespace = '_dts_jest_runtime_';

export const trigger_regex = /^\s*\/\/\s*@dts-jest\b(:?\S*)\s*(.+)?\s*$/;
export enum TriggerMatchIndex {Input, Flags, Description}
export type TriggerMatchArray = [string, string, string | undefined];

export enum TestMethod {
  Test = 'test',
  Skip = 'test.skip',
  Only = 'test.only',
}
export enum TestFlag {
  Test = ':test',
  Only = ':only',
  Skip = ':skip',
}
export enum AssertionFlag {
  Shot = ':shot',
  Show = ':show',
  Pass = ':pass',
  Fail = ':fail',
}

export interface Target {
  /**
   * 0-based
   */
  line: number;
  expression: string;
  description?: string;
}
export interface Trigger extends Target {
  flag: AssertionFlag;
  method: TestMethod;
}

export interface Snapshot {
  inference?: string;
  diagnostic?: string;
}

export interface Result extends Target, Snapshot {}

export interface RawConfig {
  tsconfig?: string | ts.CompilerOptions;
  type_format?: ts.TypeFormatFlags;
}
