import { cwd_serializer } from './helpers/cwd-serializer';
import { version_serializer } from './helpers/version-serializer';
import { Reporter } from './reporter';

expect.addSnapshotSerializer(cwd_serializer);
expect.addSnapshotSerializer(version_serializer);

// tslint:disable-next-line:no-unbound-method
const original_stdout_write = process.stdout.write;
let mocked_stdout_write: jest.MockInstance<any>;

beforeEach(() => {
  mocked_stdout_write = process.stdout.write = jest.fn();
});

afterAll(() => {
  process.stdout.write = original_stdout_write;
});

it('should report correctly', () => {
  const reporter = new Reporter(create_config());
  reporter.onRunComplete(new Set([create_context()]));
  expect(get_write_content()).toMatchSnapshot();
});

function create_context(): jest.Context {
  return {
    config: {
      rootDir: process.cwd(),
      globals: {},
    },
  } as any;
}

function create_config(): jest.GlobalConfig {
  return { useStderr: false } as any;
}

function get_write_content() {
  return mocked_stdout_write.mock.calls.map(x => x.join('')).join('');
}
