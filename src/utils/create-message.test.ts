import { create_message } from './create-message';

it('should return correctly', () => {
  expect(
    create_message('my description', ['data 1', 'data 2', 'data 3']),
  ).toMatchSnapshot();
});
