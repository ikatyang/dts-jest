import * as path from 'path';
import { remap_cli } from '../remap-cli';

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
    '../../fixtures/remap/__snapshots__/general.ts.snap',
  );
  remap_cli([filename]);
  // tslint:disable-next-line:no-unbound-method
  const mocked_write: jest.Mock<any> = process.stdout.write as any;
  expect(mocked_write.mock.calls[0]).toMatchSnapshot();
});

it('should throw error if args.length !== 1', () => {
  expect(() => remap_cli([])).toThrowError();
});
