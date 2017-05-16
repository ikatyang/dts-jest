import * as ts from 'typescript';

export type TriggerDescription = null | string;

export interface ITrigger {
  line: number;
  kind: TriggerKind;
  description: TriggerDescription;
}

export interface ITriggerDescriptions {
  [line: number]: TriggerDescription;
}

export enum TriggerKind {
  None,
  Skip,
  Only,
  Show,
}

export interface ITSConfig {
  extends?: string;
  compilerOptions?: ts.CompilerOptions;
}

export type IRawTSConfig = undefined | string | ts.CompilerOptions;

export interface ISelfConfig {
  tsconfig?: IRawTSConfig;
  reporter?: string;
}

export const default_reporter_template = '\nInferred\n\n{{expression,2}}\n\nto be\n\n{{snapshot,2}}';

export interface IJestConfig {
  globals: {
    _dts_jest_: ISelfConfig;
  };
}

export const config_namespace = '_dts_jest_';
export const runtime_namespace = '_dts_jest_runtime_';

export const trigger_regex = /^\s*\/\/\s*@dts-jest\b(:\S*)?\s*(.+)?\s*$/;
export enum TriggerMatchIndex {
  Input,
  Flag,
  Description,
}
export type ITriggerMatchArray = [
  string,
  string | undefined,
  string | undefined
];

export interface IRuntimeSnapshotParameters {
  line: number;
}
export interface IRuntimeDescriptionParameters {
  line: number;
}
export interface IRuntimeReportParameters {
  line: number;
}

export interface IRuntimeMethods {
  report(parameters: IRuntimeReportParameters): string;
  snapshot(parameters: IRuntimeSnapshotParameters): string;
  description(parameters: IRuntimeDescriptionParameters): string;
}
