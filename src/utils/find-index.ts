export const find_index = <T>(array: T[], matcher: (value: T, index: number, array: T[]) => boolean) => {
  for (let i = 0; i < array.length; i++) {
    if (matcher(array[i], i, array)) {
      return i;
    }
  }
  return -1;
};
