export const repeat = (str: string, count: number) => {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += str;
  }
  return result;
};
