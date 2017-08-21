import { Trigger } from '../definitions';

export const get_expression_end_line = (trigger: Trigger) => {
  const expression_line_count = trigger.expression.split('\n').length;
  return trigger.line + expression_line_count;
};
