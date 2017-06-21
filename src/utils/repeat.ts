export const repeat = (char: string, count: number) => {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += char;
  }
  return result;
};
