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
