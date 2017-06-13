import * as tsconfig_extends from 'tsconfig-extends';
import * as ts from 'typescript';
import {RawConfig} from '../definitions';
import {default_to} from './default-to';

export const get_tsconfig = (raw_config: RawConfig): ts.CompilerOptions => {
  const raw_tsconfig = default_to(
    raw_config.tsconfig,
    {},
  );
  return (typeof raw_tsconfig === 'string')
    ? tsconfig_extends.load_file_sync(raw_tsconfig.replace('<cwd>', process.cwd()))
    : raw_tsconfig;
};
