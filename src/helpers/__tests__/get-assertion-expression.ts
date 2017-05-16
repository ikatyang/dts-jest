jest.unmock('../get-assertion-expression');

import {TriggerKind} from '../../definitions';
import {get_assertion_expression} from '../get-assertion-expression';

const line = 1;

it('should return console.log() while kind is show', () => {
  expect(get_assertion_expression(TriggerKind.Show, line)).toMatchSnapshot();
});

it('should return expect().toMatchSnapshot() while kind is not show', () => {
  expect(get_assertion_expression(TriggerKind.None, line)).toMatchSnapshot();
});
