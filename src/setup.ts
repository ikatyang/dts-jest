import { env_root_dir, RawConfig, Trigger } from './definitions';
import { Runtime } from './runtime';
import { create_snapshots } from './utils/create-snapshots';
import { normalize_config } from './utils/normalize-config';

export const setup = (
  filename: string,
  raw_config: RawConfig,
  triggers: Trigger[],
) => {
  const normalized_config = normalize_config(raw_config);
  const snapshots = create_snapshots(filename, triggers, normalized_config);

  return new Runtime(filename, normalized_config, triggers, snapshots);
};
