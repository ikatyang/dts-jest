import { for_each, ForEachCallback } from 'ts-comment';
import * as _ts from 'typescript';

export const for_each_comment: (
  source: string | _ts.SourceFile,
  callback: ForEachCallback,
  ts: typeof _ts,
) => void = for_each as any;
