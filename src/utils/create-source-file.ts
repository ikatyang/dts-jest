import * as _ts from 'typescript';

export const create_source_file = (
  filename: string,
  source: string,
  ts: typeof _ts,
) => ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
