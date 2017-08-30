import { GroupMethod } from '../definitions';
import { apply_grouping } from './apply-grouping';

it('should return correctly with groups (length = 0)', () => {
  expect(
    apply_grouping(['/* line 1 */', '/* line 2 */', '/* line 3 */'], []),
  ).toMatchSnapshot();
});

it('should return correctly with groups (length = 1)', () => {
  expect(
    apply_grouping(
      ['/* line 1 */', '/* line 2 */', '/* line 3 */'],
      [{ line: 1, method: GroupMethod.Test, description: 'group L2' }],
    ),
  ).toMatchSnapshot();
});

it('should return correctly with groups (length > 1)', () => {
  expect(
    apply_grouping(
      [
        '/* line 1 */',
        '/* line 2 */',
        '/* line 3 */',
        '/* line 4 */',
        '/* line 5 */',
        '/* line 6 */',
        '/* line 7 */',
        '/* line 8 */',
        '/* line 9 */',
      ],
      [
        { line: 2, method: GroupMethod.Test, description: 'group L3' },
        { line: 4, method: GroupMethod.Test, description: 'group L5' },
        { line: 7, method: GroupMethod.Test, description: 'group L8' },
      ],
    ),
  ).toMatchSnapshot();
});
