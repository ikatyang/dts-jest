export const default_to = <T>(value: undefined | T, default_value: T): T =>
  (value === undefined)
    ? default_value
    : value;
