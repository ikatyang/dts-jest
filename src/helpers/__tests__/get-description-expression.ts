jest.unmock('../get-description-expression');

import {get_description_expression} from '../get-description-expression';

const line = 1;

it('should return correctly', () => {
  expect(get_description_expression(line)).toMatchSnapshot();
});
