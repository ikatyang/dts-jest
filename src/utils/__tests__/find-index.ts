jest.unmock('../find-index');

import {find_index} from '../find-index';

it('should return index while target existed', () => {
  const array = ['1', '2', '3'];
  expect(find_index(array, value => value === '2')).toBe(1);
});

it('should return -1 while target is not existed', () => {
  const array = ['1', '2', '3'];
  expect(find_index(array, value => value === '0')).toBe(-1);
});
