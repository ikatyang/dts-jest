import {repeat} from './repeat';

export const indent_title = (title: string, spaces: number) =>
  title.replace(/\n/g, `\n${repeat(' ', spaces)}`);
