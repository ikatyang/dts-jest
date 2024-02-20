import * as fs from 'fs';
import { cwd_serializer } from './helpers/cwd-serializer';
import { get_fixture_filename } from './helpers/load-fixture';
import { version_serializer } from './helpers/version-serializer';
import { remap_cli } from './remap-cli';
import { create_remap_cli_parser } from './remap-cli-parser';

expect.addSnapshotSerializer(cwd_serializer);
expect.addSnapshotSerializer(version_serializer);

const console_log = jest.spyOn(console, 'log');
const console_error = jest.spyOn(console, 'error');
const wrtie_file_sync = jest.spyOn(fs, 'writeFileSync');
const process_exit = jest.spyOn(process, 'exit');

beforeAll(() => {
  console_log.mockReturnThis();
  console_error.mockReturnThis();
  wrtie_file_sync.mockReturnThis();
  process_exit.mockImplementation(code => {
    if (code !== 0) {
      throw new Error(`Exit with code ${code}`);
    }
  });
});

beforeEach(() => {
  console_log.mockClear();
  console_error.mockClear();
  wrtie_file_sync.mockClear();
});

afterAll(() => {
  console_log.mockRestore();
  console_error.mockRestore();
  wrtie_file_sync.mockRestore();
  process_exit.mockRestore();
});

const remap_cli_parser = create_remap_cli_parser();

it('should remap correctly', () => {
  run_cli('example.ts', ['--rename', '{{basename}}.snap.{{extname}}']);
  expect(wrtie_file_sync.mock.calls[0][1]).toMatchSnapshot();
});

it('should write path correctly with --rename', () => {
  run_cli('example.ts', ['--rename', '{{basename}}.snap.{{extname}}']);
  expect(wrtie_file_sync.mock.calls[0][0]).toMatchSnapshot();
});

it('should write path correctly with --outDir', () => {
  run_cli('example.ts', ['--outDir', './snapshots']);
  expect(wrtie_file_sync.mock.calls[0][0]).toMatchSnapshot();
});

it('should log warning if there is no matched file', () => {
  run_cli('---not-exist---', []);
  expect(get_console_content(console_log)).toMatchSnapshot();
});

it('should log diff filenames correctly with --listDifferent', () => {
  run_cli('example.ts', ['--listDifferent', '--rename', 'empty.ts']);
  expect(get_console_content(console_log)).toMatchSnapshot();
});

it('should log diff filenames correctly with --listDifferent if there is no such output file', () => {
  run_cli('example.ts', ['--listDifferent', '--rename', '___not_exist___.ts']);
  expect(get_console_content(console_log)).toMatchSnapshot();
});

it('should throw error if differences exist with --check', () => {
  expect(() =>
    run_cli('example.ts', ['--check', '--rename', 'empty.ts']),
  ).toThrowErrorMatchingSnapshot();
});

it('should not throw error if there is no difference with --check', () => {
  expect(() =>
    run_cli('example.ts', ['--check', '--rename', 'remapped.ts']),
  ).not.toThrow();
});

it('should throw error with differences if differences exist with --check and --listDifferent', () => {
  expect(() =>
    run_cli('example.ts', [
      '--check',
      '--listDifferent',
      '--rename',
      'empty.ts',
    ]),
  ).toThrowErrorMatchingSnapshot();
});

it('should throw error if there is no input', () => {
  expect(() => remap_cli(remap_cli_parser([]))).toThrow();
  expect(get_console_content(console_error)).toMatchSnapshot();
});

it('should throw error if input and output file are the same', () => {
  expect(() => run_cli('example.ts', [])).toThrowErrorMatchingSnapshot();
});

it('should log typescript information', () => {
  run_cli('example.ts', ['--rename', '{{basename}}.snap.{{extname}}']);
  expect(get_console_content(console_log)).toMatchSnapshot();
});

function run_cli(test_glob: string, args: string[]) {
  const filename = get_fixture_filename(`remap-cli/${test_glob}`);
  remap_cli(remap_cli_parser([filename, ...args]));
}

function get_console_content(console_fn: jest.SpyInstance<typeof console.log>) {
  return console_fn.mock.calls.map(x => x[0]).join('\n');
}
