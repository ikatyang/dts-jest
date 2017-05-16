import {
  IRawTSConfig,
  ITSConfig,
} from '../definitions';

export const load_tsconfig = (raw_tsconfig: IRawTSConfig): ITSConfig =>
  (typeof raw_tsconfig === 'string')
    ? {extends: raw_tsconfig}
    : (typeof raw_tsconfig === 'object')
      ? {compilerOptions: raw_tsconfig}
      : {};
