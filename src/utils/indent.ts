export const indent = (str: string, spaces: number) =>
  str.replace(/^/gm, ' '.repeat(spaces));
