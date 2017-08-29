export const cwd_serializer: jest.SnapshotSerializerPlugin = {
  print: (value: string, serializer) =>
    serializer(value.replace(new RegExp(process.cwd(), 'g'), '<cwd>')),
  test: (value: any) =>
    typeof value === 'string' && value.indexOf(process.cwd()) !== -1,
};
