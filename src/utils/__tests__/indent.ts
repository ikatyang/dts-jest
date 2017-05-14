jest.unmock('../indent');

import {indent} from '../indent';

const str = `
line 1

line 2

line 3
`;

it('should return correctly', () => {
  // tslint:disable-next-line:no-magic-numbers
  expect(indent(str, 2)).toMatchSnapshot();
});
