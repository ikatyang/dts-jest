import { indent } from './indent';

export const create_message = (
  description: string,
  data: string[],
  footer?: string,
) => {
  const content = data
    .map(line_content => indent(line_content, 2))
    .join('\n')
    .replace(/ +$/gm, '');

  return footer === undefined
    ? `${description}\n\n${content}`
    : `${description}\n\n${content}\n\n${footer}`;
};
