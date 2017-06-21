import {Group} from '../definitions';

export const create_group_expression = (group: Group, options: {type: 'open' | 'close'}) =>
  (options.type === 'open')
    ? `${group.method}(${JSON.stringify(group.title)}, function () {`

    : `})`;
