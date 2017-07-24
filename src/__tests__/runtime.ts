import { Runtime } from '../runtime';

// tslint:disable:no-bitwise

enum Line {
  Inference = 1 << 0,
  Description = 1 << 1,
  Diagnostic = 1 << 2,
}

let runtime: Runtime;
beforeAll(() => {
  runtime = new Runtime({
    [Line.Inference]: {
      line: Line.Inference,
      inference: 'inference',
      expression: 'expression',
    },
    [Line.Inference | Line.Description]: {
      line: Line.Inference | Line.Description,
      inference: 'inference',
      expression: 'expression',
      description: 'description',
    },
    [Line.Diagnostic]: {
      line: Line.Diagnostic,
      diagnostic: 'diagnostic',
      expression: 'expression',
    },
  });
});

test('#snapshot() should return correctly with inference', () => {
  expect(runtime.snapshot(Line.Inference)).toMatchSnapshot();
});

test('#snapshot() should return correctly with diagnostic', () => {
  expect(() =>
    runtime.snapshot(Line.Diagnostic),
  ).toThrowErrorMatchingSnapshot();
});

test('#safe_snapshot() should return correctly with inference', () => {
  expect(runtime.safe_snapshot(Line.Inference)).toMatchSnapshot();
});

test('#safe_snapshot() should return correctly with diagnostic', () => {
  expect(runtime.safe_snapshot(Line.Diagnostic)).toMatchSnapshot();
});

test('#report() should return correctly', () => {
  expect(runtime.report(Line.Inference)).toMatchSnapshot();
});

test('#report() should return correctly with description', () => {
  expect(runtime.report(Line.Inference | Line.Description)).toMatchSnapshot();
});
