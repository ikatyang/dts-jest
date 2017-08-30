import { Trigger, TriggerFooterFlag, TriggerHeaderFlags } from '../definitions';

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
  push_value_show_if_available();
  push_type_pass_if_available();
  push_type_fail_if_available();
  push_value_equal_if_available();
  push_value_error_if_available();
  push_value_no_error_if_available();
  push_type_snap_if_available();

  if (expressions.length === 0) {
    expressions.push(`expect.hasAssertions()`);
  }

  return expressions.join(';');

  // tslint:disable:early-exit
  function push_type_show_if_available() {
    if (options.test_type && header.flags & TriggerHeaderFlags[':show']) {
      expressions.push(`console.log(${options.get_type_report_expression})`);
    }
  }

  function push_type_pass_if_available() {
    if (options.test_type && header.flags & TriggerHeaderFlags[':pass']) {
      expressions.push(
        `expect(function () { ${options.get_type_inference_or_throw_diagnostic_expression} }).not.toThrowError()`,
      );
    }
  }

  function push_type_fail_if_available() {
    if (options.test_type && header.flags & TriggerHeaderFlags[':fail']) {
      expressions.push(
        `expect(function () { ${options.get_type_inference_or_throw_diagnostic_expression} }).toThrowError()`,
      );
    }
  }

  function push_type_snap_if_available() {
    if (options.test_type && header.flags & TriggerHeaderFlags[':snap']) {
      expressions.push(
        `expect(${options.get_type_inference_or_diagnostic_expression}).toMatchSnapshot()`,
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
        `expect(${body.expression}).toEqual(${footer.expected})`,
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
        `expect(function () { ${body.expression} }).toThrowError()`,
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
        `expect(function () { ${body.expression} }).not.toThrowError()`,
      );
    }
  }

  function push_value_show_if_available() {
    if (
      options.test_value &&
      footer !== undefined &&
      footer.flag === TriggerFooterFlag.Show
    ) {
      expressions.push(`console.log(${options.get_value_report_expression})`);
    }
  }
  // tslint:enable:early-exit
};
