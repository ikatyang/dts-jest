export const safe_snapshot = (getter: () => any) => {
  try {
    return getter();
  } catch (error) {
    return (error as Error).message;
  }
};
