const server_pid = 1234;
const server_port = 8888;

jest.mock('../config', () => ({
  get_jest_configs: () => ({config: undefined}),
  get_server_port: () => server_port,
}));

jest.mock('../server', () => ({
  Server: {
    request_pid: jest.fn(),
    request_reset_mark: jest.fn(),
    request_reset_start: jest.fn(),
    request_close: jest.fn(),
  },
}));

import * as path from 'path';
import {transformer_filename} from '../definitions';
import {Reporter} from '../reporter';
import {Server} from '../server';

const process_on = process.on;
const process_argv = process.argv;
const process_exit = process.exit;
const process_kill = process.kill;

beforeAll(() => {
  Object.defineProperties(process, {
    on: {value: jest.fn()},
    argv: {value: {slice: jest.fn()}},
    exit: {value: jest.fn()},
    kill: {value: jest.fn()},
  });
});

afterAll(() => {
  Object.defineProperties(process, {
    on: {value: process_on},
    argv: {value: process_argv},
    exit: {value: process_exit},
    kill: {value: process_kill},
  });
});

it('should setup process event corretly while watch is true and counter is 0', () => {
  const reporter = new Reporter({watch: true}, undefined);

  const [port, port_callback] = (Server.request_pid as any as jest.MockInstance<any>).mock.calls[0];
  expect(port).toBe(server_port);

  reporter.exiting = false;
  port_callback();
  expect(process.kill).not.toBeCalled();

  reporter.exiting = true;
  port_callback();
  expect(process.kill).toBeCalled();

  const [exit_event, exit_callback] = (process.on as any as jest.MockInstance<any>).mock.calls[0];
  expect(exit_event).toBe('exit');

  reporter.exiting = false;
  reporter.server_pid = undefined;
  exit_callback();
  expect(reporter.exiting).toBe(true);

  reporter.exiting = false;
  reporter.server_pid = server_pid;
  exit_callback();
  expect(process.kill).toBeCalled();
  expect(process.exit).toBeCalled();
});

it('should not setup process event twice while watch is false or counter is not 0', () => {
  const reporter = new Reporter({watch: false}, undefined);
  expect(process.on).toHaveBeenCalledTimes(1);
});

test('Reporter#onRunStart() should mark server as reseting and request for reseting', () => {
  let filenames_callback: any;
  const report = {port: server_port, get_filenames: (callback: any) => { filenames_callback = callback; }};
  Reporter.prototype.onRunStart.call(report);
  expect(Server.request_reset_mark).toBeCalled();
  expect(Server.request_reset_start).not.toBeCalled();

  const filenames = ['file.ts'];
  filenames_callback(filenames);
  expect(Server.request_reset_start).toBeCalledWith(server_port, filenames);
});

test('Reporter#onRunComplete() should request server for closing while watch is false', () => {
  const report_watching = {port: server_port, global_config: {watch: true}};
  Reporter.prototype.onRunComplete.call(report_watching);
  expect(Server.request_close).not.toBeCalled();

  const report_not_watching = {port: server_port, global_config: {watch: false}};
  Reporter.prototype.onRunComplete.call(report_not_watching);
  expect(Server.request_close).toBeCalled();
});

test('Reporter#get_filenames() should return correctly', done => {
  const testMatch = ['**/*.ts'];
  const testRegex = ['\\.ts$'];
  const config = {
    rootDir: path.resolve(__dirname, '../../fixtures/find-files'),
    testPathIgnorePatterns: ['/ignored/'],
    transform: {'/a\\w+\\.ts$': transformer_filename},
    transformIgnorePatterns: ['/\\w+2\\.ts$'],
  };

  let counter = 0;
  let match_results: string[];
  let regex_results: string[];

  const check_if_done = () => {
    if (++counter === 2) {
      expect(match_results).toEqual(regex_results);
      expect(match_results).toMatchSnapshot();
      done();
    }
  };

  Reporter.prototype.get_filenames.call(
    {
      config: {...config, testMatch},
    },
    (filenames: string[]) => {
      match_results = filenames;
      check_if_done();
    },
  );

  Reporter.prototype.get_filenames.call(
    {
      config: {...config, testRegex},
    },
    (filenames: string[]) => {
      regex_results = filenames;
      check_if_done();
    },
  );

});
