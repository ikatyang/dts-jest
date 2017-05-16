jest.unmock('../get-test-method-name');

import {TriggerKind} from '../../definitions';
import {get_test_method_name} from '../get-test-method-name';

it('should return correctly while kind is valid', () => {
  expect(get_test_method_name(TriggerKind.Show)).toMatchSnapshot('show');
  expect(get_test_method_name(TriggerKind.Skip)).toMatchSnapshot('skip');
  expect(get_test_method_name(TriggerKind.Only)).toMatchSnapshot('only');
  expect(get_test_method_name(TriggerKind.None)).toMatchSnapshot('none');
});

it('should throw error while flag is invalid', () => {
  expect(() => get_test_method_name(-1)).toThrowError();
});
