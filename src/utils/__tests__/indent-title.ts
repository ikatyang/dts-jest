jest.unmock('../indent-title');

import {indent_title} from '../indent-title';

const str = `
line 1

line 2

line 3
`;

it('should return correctly', () => {
  // tslint:disable-next-line:no-magic-numbers
  expect(indent_title(str, 2)).toMatchSnapshot();
});
