import { ActualRuntime } from '../runtime-actual';

const enum Line {
  Normal,
  Description,
}

let runtime: ActualRuntime;
beforeEach(() => {
  runtime = new ActualRuntime({
    [Line.Normal]: {
      line: Line.Normal,
      expression: 'expression',
      value: 'does not matter',
    },
    [Line.Description]: {
      line: Line.Description,
      description: 'description',
      expression: 'expression',
      value: 'does not matter',
    },
  });
});

test('#report() should return correctly', () => {
  expect(runtime.report(Line.Normal, () => 'actual-value')).toMatchSnapshot();
});

test('#report() should return correctly with description', () => {
  expect(
    runtime.report(Line.Description, () => 'actual-value'),
  ).toMatchSnapshot();
});
