export const safe_snapshot = (
  getter: () => any,
  transformer = (value: any) => value,
) => {
  try {
    return transformer(getter());
  } catch (error) {
    return (error as Error).message;
  }
};
