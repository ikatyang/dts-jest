import {Expressions, Snapshots} from '../definitions';
import {Runtime} from '../runtime';

let runtime: Runtime;
beforeAll(() => {
  const snapshots: Snapshots = {0: 'snapshot'};
  const expressions: Expressions = {0: 'expression'};
  runtime = new Runtime(expressions, snapshots);
});

test('#snapshot() should return correctly', () => {
  expect(runtime.snapshot(0)).toMatchSnapshot();
});

test('#report() should return correctly', () => {
  expect(runtime.report(0)).toMatchSnapshot();
});
