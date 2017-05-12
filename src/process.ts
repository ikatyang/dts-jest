import {ITSConfig} from './definitions';
import {transform} from './transform';

export const process = (source_text: string, source_filename: string, configs: {[key: string]: any}) => {
  // tslint:disable-next-line:strict-boolean-expressions
  const self_configs = configs.globals._dts_jest_ || {};
  const raw_tsconfig = self_configs.tsconfig;
  const tsconfig: ITSConfig = (typeof raw_tsconfig === 'string')
    ? {extends: raw_tsconfig.replace('<rootDir>', configs.rootDir)}
    : (typeof raw_tsconfig === 'object')
      ? {compilerOptions: raw_tsconfig}
      : {compilerOptions: {}};
  return transform({source_text, source_filename, tsconfig});
};
