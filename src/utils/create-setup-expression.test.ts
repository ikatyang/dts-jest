import * as ts from 'typescript';
import { load_fixture_source_file } from '../helpers/load-fixture';
import { create_setup_expression } from './create-setup-expression';
import { find_triggers } from './find-triggers';

it('should return correctly', () => {
  const source_file = load_fixture_source_file(
    'create-setup-expression/example.ts',
    ts,
  );
  const triggers = find_triggers(source_file, ts);
  expect(create_setup_expression(triggers)).toMatchSnapshot();
});
