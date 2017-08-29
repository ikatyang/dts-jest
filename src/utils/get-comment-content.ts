export const get_comment_content = (comment: string) =>
  comment.startsWith('//')
    ? comment.slice(2).trim()
    : comment.slice(2, -2).trim();
