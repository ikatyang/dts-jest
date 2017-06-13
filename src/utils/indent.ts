export const indent = (str: string, spaces: number) => {
  let indentation = '';
  for (let i = 0; i < spaces; i++) {
    indentation += ' ';
  }
  return str.replace(/^/mg, indentation);
};
