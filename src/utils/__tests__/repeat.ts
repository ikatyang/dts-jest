jest.unmock('../repeat');

import {repeat} from '../repeat';

it('should return correctly', () => {
  const str = 'test';
  // tslint:disable-next-line:no-magic-numbers
  expect(repeat(str, 3)).toBe(`${str}${str}${str}`);
});
