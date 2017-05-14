import * as ts from 'typescript';

export interface ITrigger {
  line: number;
  kind: TriggerKind;
  expression: string;
  description?: string;
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

export interface ISelfConfig {
  tsconfig: ITSConfig;
}

export interface IRawSelfConfig {
  tsconfig?: string | ts.CompilerOptions;
}

export interface IJestConfig {
  rootDir: string;
  globals: {
    _dts_jest_?: IRawSelfConfig;
  };
}
