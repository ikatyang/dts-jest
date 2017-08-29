import { TriggerHeader, TriggerHeaderFlags } from '../definitions';

export const trigger_header_serializer: jest.SnapshotSerializerPlugin = {
  print: (value: TriggerHeader, serializer) => {
    const flag_literals: string[] = [];

    let { flags } = value;

    for (let base = 1; flags !== 0; flags >>= 1, base <<= 1) {
      if (flags & 1) {
        flag_literals.push(TriggerHeaderFlags[base]);
      }
    }

    return serializer({ ...value, flag_literals });
  },
  test: (value: any) =>
    typeof value === 'object' &&
    typeof value.flags === 'number' &&
    !('flag_literals' in value),
};
