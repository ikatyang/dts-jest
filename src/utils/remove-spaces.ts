export const remove_spaces = (text: string) =>
  text.replace(/^\s+|\s+$|\n/gm, '');
