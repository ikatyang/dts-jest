const line = 1;
const snapshot = 'snapshot 1';
const expression = 'expression 1';

jest.mock('../server', () => ({
  Server: {
    request_snapshots: (_0: any, _1: any, _2: any, callback: (snapshots: Snapshots) => void) => {
      callback({
        [line]: snapshot,
      });
    },
  },
}));

import {Snapshots} from '../definitions';
import {create_runtime, Runtime} from '../runtime';

let runtime: Runtime;

beforeAll(done => {
  create_runtime({filename: ''}, {}, {[line]: expression}, the_runtime => {
    runtime = the_runtime;
    done();
  });
});

test('#snapshot() should return correctly', () => {
  expect(runtime.snapshot(line)).toBe(snapshot);
});

test('#report() should return correctly', () => {
  expect(runtime.report(line)).toMatchSnapshot();
});
