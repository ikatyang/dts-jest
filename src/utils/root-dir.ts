import { env_root_dir } from '../definitions';
import { default_to } from './default-to';

export const get_root_dir = () =>
  default_to(process.env[env_root_dir], process.cwd());
export const set_root_dir = (root_dir: string) => {
  if (process.env[env_root_dir] === undefined) {
    process.env[env_root_dir] = root_dir;
  }
};
