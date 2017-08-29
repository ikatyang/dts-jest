import * as ts from 'typescript';
import { load_fixture_source_file } from '../helpers/load-fixture';
import { create_assertion_expression } from './create-assertion-expression';
import { find_triggers } from './find-triggers';

it('should return correctly', () => {
  const triggers = find_triggers(
    load_fixture_source_file('create-assertion-expression/example.ts', ts),
    ts,
  );
  expect(
    triggers.map(trigger => [
      trigger.body.expression,
      create_assertion_expression(trigger, {
        test_type: true,
        test_value: true,
        get_type_inference_or_diagnostic_expression:
          '<get_type_inference_or_diagnostic_expression>',
        get_type_inference_or_throw_diagnostic_expression:
          '<get_type_inference_or_throw_diagnostic_expression>',
        get_type_report_expression: '<get_type_report_expression>',
        get_value_report_expression: '<get_value_report_expression>',
      }).split(';'),
    ]),
  ).toMatchSnapshot();
});
