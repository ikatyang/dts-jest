import { Trigger, TriggerFooterFlag, TriggerHeaderFlags } from '../definitions';
import { get_description_for_jest } from './get-description-for-jest';
import { get_group_description } from './get-group-description';

export interface CreateAssertionExpressionOptions {
  test_type: boolean;
  test_value: boolean;
  get_type_inference_or_diagnostic_expression: string;
  get_type_inference_or_throw_diagnostic_expression: string;
  get_type_report_expression: string;
  get_value_report_expression: string;
}

export const create_assertion_expression = (
  trigger: Trigger,
  options: CreateAssertionExpressionOptions,
) => {
  const expressions: string[] = [];

  const { header, body, footer } = trigger;

  push_type_show_if_available();
  push_type_pass_if_available();
  push_type_fail_if_available();
  push_type_snap_if_available();
  push_value_show_if_available();
  push_value_equal_if_available();
  push_value_error_if_available();
  push_value_no_error_if_available();

  return expressions.join(';');

  // tslint:disable:early-exit
  function push_type_show_if_available() {
    if (options.test_type && header.flags & TriggerHeaderFlags[':show']) {
      expressions.push(
        create_wrapper(
          '(type) should show report',
          `console.log(${options.get_type_report_expression})`,
        ),
      );
    }
  }

  function push_type_pass_if_available() {
    if (options.test_type && header.flags & TriggerHeaderFlags[':pass']) {
      expressions.push(
        create_wrapper(
          '(type) should not throw error',
          `expect(function () { ${options.get_type_inference_or_throw_diagnostic_expression} }).not.toThrowError()`,
        ),
      );
    }
  }

  function push_type_fail_if_available() {
    if (options.test_type && header.flags & TriggerHeaderFlags[':fail']) {
      expressions.push(
        create_wrapper(
          '(type) should throw error',
          `expect(function () { ${options.get_type_inference_or_throw_diagnostic_expression} }).toThrowError()`,
        ),
      );
    }
  }

  function push_type_snap_if_available() {
    if (options.test_type && header.flags & TriggerHeaderFlags[':snap']) {
      const test_description = get_description_for_jest(trigger);
      const snapshot_description = JSON.stringify(
        header.group === undefined
          ? test_description
          : `${get_group_description(header.group)} ${test_description}`,
      );
      expressions.push(
        create_wrapper(
          '(type) should match snapshot',
          `expect(${options.get_type_inference_or_diagnostic_expression}).toMatchSnapshot(${snapshot_description})`,
        ),
      );
    }
  }

  function push_value_equal_if_available() {
    if (
      options.test_value &&
      footer !== undefined &&
      footer.flag === undefined
    ) {
      expressions.push(
        create_wrapper(
          `(value) should equal to ${footer.expected}`,
          `expect(${body.expression}).toEqual(${footer.expected})`,
        ),
      );
    }
  }

  function push_value_error_if_available() {
    if (
      options.test_value &&
      footer !== undefined &&
      footer.flag === TriggerFooterFlag.Error
    ) {
      expressions.push(
        create_wrapper(
          '(value) should throw error',
          `expect(function () { ${body.expression} }).toThrowError()`,
        ),
      );
    }
  }

  function push_value_no_error_if_available() {
    if (
      options.test_value &&
      footer !== undefined &&
      footer.flag === TriggerFooterFlag.NoError
    ) {
      expressions.push(
        create_wrapper(
          '(value) should not throw error',
          `expect(function () { ${body.expression} }).not.toThrowError()`,
        ),
      );
    }
  }

  function push_value_show_if_available() {
    if (
      options.test_value &&
      footer !== undefined &&
      footer.flag === TriggerFooterFlag.Show
    ) {
      expressions.push(
        create_wrapper(
          '(value) should show report',
          `console.log(${options.get_value_report_expression})`,
        ),
      );
    }
  }
  // tslint:enable:early-exit

  function create_wrapper(title: string, expression: string) {
    const description = JSON.stringify(title);
    const { header: { method } } = trigger;
    return `${method}(${description}, function () { ${expression} })`;
  }
};
