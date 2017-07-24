import { repeat } from './repeat';

export const indent = (str: string, spaces: number) =>
  str.replace(/^/gm, repeat(' ', spaces));
