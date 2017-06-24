import {Trigger} from '../definitions';
import {default_to} from './default-to';
import {repeat} from './repeat';

const jest_title_leading_spaces_count = 4;
const jest_grouped_title_leading_spaces_count = 6;

export const get_formatted_description = (trigger: Trigger, ignore_group: boolean) =>
  default_to(trigger.description, trigger.expression)
    .replace(/\n/g, `\n${
      repeat(
        ' ',
        (ignore_group || trigger.group === undefined)
          ? jest_title_leading_spaces_count
          : jest_grouped_title_leading_spaces_count,
        )
    }`);
