import * as ts from 'typescript';

// tslint:disable-next-line:no-require-imports no-var-requires
export const package_name = require('../package.json').name;

export const config_namespace = '_dts_jest_';
export const runtime_namespace = '_dts_jest_runtime_';

export const trigger_regex = /^\s*\/\/\s*@dts-jest\b(:?\S*)\s*(.+)?\s*$/;
export enum TriggerMatchIndex {Input, Flag, Description}
export type TriggerMatchArray = [string, string, string | undefined];

export enum TriggerFlag {
  None = '',
  Show = ':show',
  Skip = ':skip',
  Only = ':only',
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
  flag: TriggerFlag;
  method: TestMethod;
}

export interface Snapshots {
  [line: number]: string;
}
export interface Expressions {
  [line: number]: string;
}

export interface Result extends Target {
  snapshot: string;
}
export interface Results {
  [line: number]: Result;
}

export enum TestMethod {
  Test = 'test',
  Skip = 'test.skip',
  Only = 'test.only',
}

export interface RawConfig {
  tsconfig?: string | ts.CompilerOptions;
  type_format?: ts.TypeFormatFlags;
}
