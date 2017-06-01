import {RequestCallback} from 'request';

let body: string;

jest.mock('request', () => ({
  get: (url: string, options: any, callback: RequestCallback) => {
    callback(null, {statusCode: 200} as any, body);
    return [url, options];
  },
}));

jest.mock('express', () => () => ({
  listen: () => ({
    close: jest.fn(),
  }),
  get: jest.fn(),
}));

jest.mock('typescript', () => ({
  createProgram: jest.fn(() => jest.fn()),
}));

import * as ts from 'typescript';
import {create_server, Server} from '../server';
import {get_snapshots, request_server} from '../utils';

const port = 10086;

test('Server.request_close() should request correctly', () => {
  expect(Server.request_close(port)).toMatchSnapshot();
});

test('Server.request_pid() should request correctly', () => {
  body = JSON.stringify(10086);
  expect(Server.request_pid(port, pid => {
    expect(pid).toMatchSnapshot();
  })).toMatchSnapshot();
});

test('Server.request_reset_mark() should request correctly', () => {
  expect(Server.request_reset_mark(port)).toMatchSnapshot();
});

test('Server.request_reset_start() should request correctly', () => {
  expect(Server.request_reset_start(port, ['f1.ts', 'f2.ts'])).toMatchSnapshot();
});

test('Server.request_reset_start() should request correctly', () => {
  body = JSON.stringify({
    1: 'snapshot 1',
    2: 'snapshot 2',
    3: 'snapshot 3',
  });
  expect(Server.request_snapshots(port, 'f1.ts', [1, 2, 3], snapshots => {
    expect(snapshots).toMatchSnapshot();
  })).toMatchSnapshot();
});

describe('server', () => {
  const exit = process.exit;
  const log = console.log;
  beforeAll(() => {
    Object.defineProperty(process, 'exit', {
      value: jest.fn(),
    });
    Object.defineProperty(console, 'log', {
      value: jest.fn(),
    });
  });

  let server: Server;
  beforeEach(() => {
    server = create_server({
      rootDir: 'path/to/somewhere',
      globals: {
        _dts_jest_: {
          tsconfig: {},
        },
      },
    } as any);
  });

  test('#close() should close server and exit process', () => {
    server.close();
    expect(server.server.close).toBeCalled();
    expect(process.exit).toBeCalled();
  });

  test('#log() should log if debug = true', () => {
    Server.prototype.log.call({debug: true}, 'message');
    expect((console.log as any as jest.MockInstance<any>).mock.calls[0][0]).toMatchSnapshot();
  });

  test('#reset_program() should reset program and execute callbacks if exist', done => {
    const origin_program = server.program;
    server.reset_program([]);

    const callback = jest.fn();
    server.callbacks = [callback];

    setImmediate(() => {
      expect(ts.createProgram).toBeCalled();
      expect(callback).toBeCalled();
      expect(server.program).not.toBe(origin_program);
      done();
    });
  });

  test('#reset_program() should not reset program and while it is not the last reseting', done => {
    const origin_program = server.program;
    server.reset_program([]);

    const callback = jest.fn();
    server.callbacks = [callback];

    server.last_reset = Infinity;

    setImmediate(() => {
      expect(ts.createProgram).toBeCalled();
      expect(callback).not.toBeCalled();
      expect(server.program).toBe(origin_program);
      done();
    });
  });

  afterAll(() => {
    Object.defineProperty(console, 'log', {
      value: log,
    });
  });
});
