import * as ts from 'typescript';
import { load_fixture } from './helpers/load-fixture';
import { remap } from './remap';
import { snapshot_assertion_message } from './utils/create-assertion-expression';

it('should remap correctly', () => {
  expect(get_remapped('example')).toMatchSnapshot();
});

it('should throw error if there is unmatched snapshot', () => {
  expect(() => get_remapped('unmatched')).toThrowErrorMatchingSnapshot();
});

it('should throw error if there is non-string value in snapshot value', () => {
  const source_content = `
    // @dts-jest:snap
    Math.max(1, 2, 3);
  `;
  const snapshot_content = {
    [`Math.max(1, 2, 3) ${snapshot_assertion_message} 1`]: 123,
  };
  expect(() =>
    remap(source_content, snapshot_content),
  ).toThrowErrorMatchingSnapshot();
});

function get_remapped(id: string) {
  return remap(
    load_fixture(`remap/${id}.ts`),
    load_fixture(`remap/__snapshots__/${id}.ts.snap`),
    { typescript: ts },
  );
}
