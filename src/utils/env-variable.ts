export const set_env_variable = (id: string, value: any) =>
  (process.env[id] = value);
export const get_env_variable = (id: string) => process.env[id];
