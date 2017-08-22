import * as tsconfig_extends from 'tsconfig-extends';
import * as _ts from 'typescript';
import { RawConfig } from '../definitions';
import { replace_root_dir } from './replace-root-dir';

export const get_tsconfig = (
  raw_tsconfig: RawConfig['tsconfig'] = {},
  root_dir: string,
): _ts.CompilerOptions =>
  typeof raw_tsconfig === 'string'
    ? tsconfig_extends.load_file_sync(replace_root_dir(raw_tsconfig, root_dir))
    : raw_tsconfig;
