import {IJestConfig, ISelfConfig, ITSConfig} from './definitions';
import {transform} from './transform';

export const process = (source_text: string, source_filename: string, jest_config: IJestConfig) => {
  const {
    _dts_jest_: raw_self_config = {},
  } = jest_config.globals;

  const tsconfig: ITSConfig = (typeof raw_self_config.tsconfig === 'string')
    ? {extends: raw_self_config.tsconfig.replace('<rootDir>', jest_config.rootDir)}
    : (typeof raw_self_config.tsconfig === 'object')
      ? {compilerOptions: raw_self_config.tsconfig}
      : {compilerOptions: {}};

  const self_config: ISelfConfig = {
    tsconfig,
  };
  return transform({source_text, source_filename, self_config});
};
