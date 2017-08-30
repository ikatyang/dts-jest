import { Trigger } from '../definitions';

const jest_title_leading_spaces_count = 4;
const jest_grouped_title_leading_spaces_count = 6;

export const get_description_for_jest = (trigger: Trigger) => {
  const { header, body } = trigger;
  const indentation = ' '.repeat(
    header.group === undefined
      ? jest_title_leading_spaces_count
      : jest_grouped_title_leading_spaces_count,
  );
  const description =
    header.description !== undefined ? header.description : body.expression;
  return description.replace(/\n/g, `\n${indentation}`);
};
