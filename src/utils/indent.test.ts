import { indent } from './indent';

it('should return correctly', () => {
  expect(indent('line 1\nline 2\nline 3', 2)).toMatchSnapshot();
});
