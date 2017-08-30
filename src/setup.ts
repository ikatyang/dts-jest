import { env_root_dir, RawConfig, Trigger } from './definitions';
import { Runtime } from './runtime';
import { create_snapshots } from './utils/create-snapshots';
import { normalize_config } from './utils/normalize-config';

export const setup = (
  filename: string,
  raw_config: RawConfig,
  triggers: Trigger[],
) => {
  // get from transform.ts
  const root_dir = process.env[env_root_dir]!;

  const normalized_config = normalize_config(raw_config, root_dir);
  const snapshots = create_snapshots(filename, triggers, normalized_config);

  return new Runtime(triggers, snapshots);
};
