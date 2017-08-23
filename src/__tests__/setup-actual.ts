import { ActualResult } from '../definitions';
import { setup_actual } from '../setup-actual';

const results: ActualResult[] = [
  { line: 0, expression: 'first', value: '123' },
  { line: 3, expression: 'second', value: '456' },
];

it('should setup correctly', () => {
  expect(setup_actual(results)).toMatchSnapshot();
});
