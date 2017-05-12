import * as ts from 'typescript';

export interface ITrigger {
  line: number;
  kind: TriggerKind;
  description: string;
}

export enum TriggerKind {
  None,
  Skip,
  Only,
}

export interface ITSConfig {
  extends?: string;
  compilerOptions?: ts.CompilerOptions;
}
