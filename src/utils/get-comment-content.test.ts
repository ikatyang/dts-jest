import { get_comment_content } from './get-comment-content';

it('should return correctly for single line comment', () => {
  expect(get_comment_content('// single-line-comment')).toMatchSnapshot();
});

it('should return correctly for multi line comment', () => {
  expect(get_comment_content('/* multi-line-comment */')).toMatchSnapshot();
});
