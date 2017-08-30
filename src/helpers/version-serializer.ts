const version_regex = /\bv[0-9]+\.[0-9]+\.[0-9]+\b/g;

export const version_serializer: jest.SnapshotSerializerPlugin = {
  print: (value: string, serializer) =>
    serializer(value.replace(version_regex, 'vX.Y.Z-mocked')),
  test: (value: any) => typeof value === 'string' && version_regex.test(value),
};
