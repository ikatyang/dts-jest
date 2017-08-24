import * as fs from 'fs';
import * as path from 'path';
import { remap_cli } from '../remap-cli';

const console_log = jest.spyOn(console, 'log');
const console_error = jest.spyOn(console, 'error');
const wrtie_file_sync = jest.spyOn(fs, 'writeFileSync');
const process_exit = jest.spyOn(process, 'exit');

beforeAll(() => {
  process_exit.mockImplementation(code => {
    if (code !== 0) {
      throw new Error(`Exit with code ${code}`);
    }
  });
});

beforeEach(() => {
  console_log.mockClear();
  console_log.mockReturnThis();
  console_error.mockClear();
  console_error.mockReturnThis();
  wrtie_file_sync.mockClear();
  wrtie_file_sync.mockReturnThis();
});

afterAll(() => {
  console_log.mockRestore();
  console_error.mockRestore();
  wrtie_file_sync.mockRestore();
  process_exit.mockRestore();
});

it('should remap correctly', () => {
  run_cli('general.ts', ['--rename', '{{basename}}.snap.{{extname}}']);
  expect(wrtie_file_sync.mock.calls[0][1]).toMatchSnapshot();
});

it('should write path correctly with --rename', () => {
  run_cli('general.ts', ['--rename', '{{basename}}.snap.{{extname}}']);
  expect(replace_cwd(wrtie_file_sync.mock.calls[0][0])).toMatchSnapshot();
});

it('should write path correctly with --outDir', () => {
  run_cli('general.ts', ['--outDir', './snapshots']);
  expect(replace_cwd(wrtie_file_sync.mock.calls[0][0])).toMatchSnapshot();
});

it('should log warning if there is no matched file', () => {
  run_cli('---not-exist---', []);
  expect(get_console_content(console_log)).toMatchSnapshot();
});

it('should log diff filenames correctly with --listDiff', () => {
  run_cli('general.ts', ['--listDiff', '--rename', 'empty.ts']);
  expect(get_console_content(console_log)).toMatchSnapshot();
});

it('should throw error if differences exist with --check', () => {
  expect(() =>
    run_cli('general.ts', ['--check', '--rename', 'empty.ts']),
  ).toThrowErrorMatchingSnapshot();
});

it('should not throw error if there is no difference with --check', () => {
  expect(() =>
    run_cli('general.ts', ['--check', '--rename', 'remapped.ts']),
  ).not.toThrow();
});

it('should throw error if there is no input', () => {
  expect(() => remap_cli([])).toThrowError();
  expect(get_console_content(console_error)).toMatchSnapshot();
});

it('should throw error if input and output file are the same', () => {
  expect(() =>
    format_error(() => run_cli('general.ts', []), replace_cwd),
  ).toThrowErrorMatchingSnapshot();
});

it('should log typescript information', () => {
  run_cli('general.ts', ['--rename', '{{basename}}.snap.{{extname}}']);
  expect(get_console_content(console_log)).toMatchSnapshot();
});

function run_cli(test_glob: string, args: string[]) {
  remap_cli([
    path.resolve(__dirname, `../../fixtures/remap-cli/${test_glob}`),
    ...args,
  ]);
}

function get_console_content(console_fn: jest.SpyInstance<typeof console.log>) {
  return replace_cwd(console_fn.mock.calls.map(x => x[0]).join('\n'));
}

function replace_cwd(str: string) {
  return str.replace(new RegExp(process.cwd(), 'g'), '<cwd>');
}

function format_error(fn: () => void, formatter: (message: string) => string) {
  try {
    fn();
  } catch (e) {
    const error = e as Error;
    throw new Error(formatter(error.message));
  }
}
