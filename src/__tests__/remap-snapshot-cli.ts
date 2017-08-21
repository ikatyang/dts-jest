import * as path from 'path';
import cli = require('../remap-snapshot-cli');

const original_stdout = process.stdout;

beforeAll(() => {
  process.stdout = { write: jest.fn() } as any;
});

afterAll(() => {
  process.stdout = original_stdout;
});

it('should remap correctly', () => {
  const filename = path.resolve(
    __dirname,
    '../../fixtures/remap-snapshot/__snapshots__/example.ts.snap',
  );
  cli([filename]);
  // tslint:disable-next-line:no-unbound-method
  const mocked_write: jest.Mock<any> = process.stdout.write as any;
  expect(mocked_write.mock.calls[0]).toMatchSnapshot();
});

it('should throw error if args.length !== 1', () => {
  expect(() => cli([])).toThrowError();
});
