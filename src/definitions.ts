import * as ts from 'typescript';

// tslint:disable-next-line:no-require-imports no-var-requires
export const package_name = require('../package.json').name;

export const config_namespace = '_dts_jest_';
export const runtime_namespace = '_dts_jest_runtime_';

export const trigger_regex = /^\s*\/\/\s*@dts-jest\b(:?\S*)\s*(.+)?\s*$/;
export enum TriggerMatchIndex {
  Input,
  Flags,
  Description,
}
export type TriggerMatchArray = [string, string, string | undefined];

export enum AssertionFlag {
  Shot = ':shot',
  Show = ':show',
  Pass = ':pass',
  Fail = ':fail',
}
export enum TestFlag {
  Test = ':test',
  Only = ':only',
  Skip = ':skip',
}
export enum TestMethod {
  Test = 'test',
  Only = 'test.only',
  Skip = 'test.skip',
}
export const group_flag = ':group';
export enum GroupMethod {
  Test = 'describe',
  Only = 'describe.only',
  Skip = 'describe.skip',
}

export interface Target {
  /**
   * 0-based
   */
  line: number;
  expression: string;
  description?: string;
  group?: Group;
}

export interface TriggerInfo {
  flag: AssertionFlag;
  method: TestMethod;
}
export interface Trigger extends Target, TriggerInfo {
  start: number;
  end: number;
}

export interface GroupInfo {
  method: GroupMethod;
}
export interface Group extends GroupInfo {
  title: string;
}

export type TriggerOrGroupInfo =
  | ({ is_group: false } & TriggerInfo)
  | ({ is_group: true } & GroupInfo);

export interface Snapshot {
  inference?: string;
  diagnostic?: string;
}
export interface Expected extends Trigger {
  value: string;
}

export interface Result extends Target, Snapshot {}

export interface JestConfig {
  globals: { [K in typeof config_namespace]?: RawConfig };
  _dts_jest_debug_?: boolean;
}

export interface RawConfig {
  tsconfig?: string | ts.CompilerOptions;
  type_format?: ts.TypeFormatFlags;
}
