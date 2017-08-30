import * as ts from 'typescript';
import { normalize_expected_value } from './normalize-expected-value';

it('should remove newline correctly', () => {
  expect(
    normalize(`
      (() => {
        switch (x) {
          case 0:
            return -1;
          default:
            return 1;
        }
      })()
    `),
  ).toMatchSnapshot();
});

it('should replace newline character with escaped newline correctly (template string)', () => {
  expect(normalize('`123\n456\n789`')).toMatchSnapshot();
});

it('should remove comments correctly', () => {
  expect(
    normalize(`
      // comment
      'test'
    `),
  ).toMatchSnapshot();
});

it('should remove trailing semicolon correctly', () => {
  expect(normalize('123')).toMatchSnapshot();
});

it('should throw error if parsing error', () => {
  expect(() => normalize('fun tion () {}')).toThrowErrorMatchingSnapshot();
});

function normalize(value: string) {
  return normalize_expected_value(value, 'somewhere.ts', -1, ts);
}
