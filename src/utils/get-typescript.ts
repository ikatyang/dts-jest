import * as _ts from 'typescript';
import { replace_root_dir } from './replace-root-dir';

let ts: typeof _ts | undefined;
let ts_path: string | undefined;

export const get_typescript = (id = 'typescript', root_dir: string) => {
  if (ts_path === undefined) {
    ts_path = require.resolve(replace_root_dir(id, root_dir));
  }
  if (ts === undefined) {
    ts = require(ts_path);
  }
  return { ts: ts!, ts_path: ts_path! };
};
