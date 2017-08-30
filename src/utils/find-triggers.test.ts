import * as ts from 'typescript';
import { load_fixture_source_file } from '../helpers/load-fixture';
import { trigger_header_serializer } from '../helpers/trigger-header-serializer';
import { find_triggers } from './find-triggers';

expect.addSnapshotSerializer(trigger_header_serializer);

it('should return correctly', () => {
  const source_file = load_fixture_source_file(`find-triggers/example.ts`, ts);
  expect(find_triggers(source_file, ts)).toMatchSnapshot();
});
