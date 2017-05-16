import {
  runtime_namespace,
  IRuntimeReportParameters,
  IRuntimeSnapshotParameters,
  TriggerKind,
} from '../definitions';

export const get_assertion_expression = (kind: TriggerKind, line: number) => {
  if (kind === TriggerKind.Show) {
    const report_parameters: IRuntimeReportParameters = {line};
    const report_value = `${runtime_namespace}.report(${JSON.stringify(report_parameters)})`;
    return `console.log(${report_value})`;
  }
  const snapshot_parameters: IRuntimeSnapshotParameters = {line};
  const snapshot_value = `${runtime_namespace}.snapshot(${JSON.stringify(snapshot_parameters)})`;
  return `expect(${snapshot_value}).toMatchSnapshot()`;
};
