import { Trigger } from '../definitions';

const jest_title_leading_spaces_count = 2;
const jest_grouped_title_leading_spaces_count = 4;

export const get_description_for_jest = (trigger: Trigger) => {
  const { header, body } = trigger;
  const indentation = ' '.repeat(
    header.group === undefined
      ? jest_title_leading_spaces_count
      : jest_grouped_title_leading_spaces_count,
  );
  const description =
    header.description !== undefined ? header.description : body.text;
  return description.replace(/\n/g, `\n${indentation}`);
};
