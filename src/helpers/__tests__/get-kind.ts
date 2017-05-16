jest.unmock('../get-kind');

import {TriggerKind} from '../../definitions';
import {get_kind} from '../get-kind';

it('should return correctly while flag is valid', () => {
  expect(get_kind(':show')).toBe(TriggerKind.Show);
  expect(get_kind(':skip')).toBe(TriggerKind.Skip);
  expect(get_kind(':only')).toBe(TriggerKind.Only);
  expect(get_kind(undefined)).toBe(TriggerKind.None);
});

it('should throw error while flag is invalid', () => {
  expect(() => get_kind(':something-else')).toThrowError();
});
