import {RequestCallback} from 'request';

let body: string;

jest.mock('request', () => ({
  get: (url: string, options: any, callback: RequestCallback) => {
    callback(null, {statusCode: 200} as any, body);
    return [url, options];
  },
}));

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
