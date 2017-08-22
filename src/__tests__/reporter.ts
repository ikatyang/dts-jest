import { config_namespace } from '../definitions';
import { Reporter } from '../reporter';

const original_stdout_write = process.stdout.write;

beforeEach(() => {
  process.stdout.write = jest.fn();
});

afterAll(() => {
  process.stdout.write = original_stdout_write;
});

it('should report correctly', () => {
  const reporter = new Reporter();
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

function get_write_content() {
  const mocked_write: jest.MockInstance<any> = process.stdout.write as any;
  return mocked_write.mock.calls
    .map(x => x.join(''))
    .join('')
    .replace(process.cwd(), '<cwd>');
}
