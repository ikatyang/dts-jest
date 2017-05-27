import * as ts from 'typescript';

export const package_name = 'dts-jest';
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
export interface Trigger {
  /**
   * 1-based
   */
  line: number;
  flag: TriggerFlag;
  method: TestMethod;
  description?: string;
}
export interface TriggerDescriptions {
  [line: number]: string | null;
}

export enum TestMethod {
  Test = 'test',
  Skip = 'test.skip',
  Only = 'test.only',
}
