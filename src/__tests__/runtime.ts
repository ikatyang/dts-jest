import {Runtime} from '../runtime';

let runtime: Runtime;
beforeAll(() => {
  runtime = new Runtime({
    0: {
      line: 0,
      snapshot: 'snapshot 0',
      expression: 'expression 0',
    },
    1: {
      line: 1,
      snapshot: 'snapshot 1',
      expression: 'expression 1',
      description: 'description 1',
    },
  });
});

test('#snapshot() should return correctly', () => {
  expect(runtime.snapshot(0)).toMatchSnapshot();
});

test('#report() should return correctly', () => {
  expect(runtime.report(0)).toMatchSnapshot();
});

test('#report() should return correctly with description', () => {
  expect(runtime.report(1)).toMatchSnapshot();
});
