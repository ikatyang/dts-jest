import * as ts from 'typescript';
import { cwd_serializer } from './helpers/cwd-serializer';
import {
  get_fixture_filename,
  load_fixture_source_file,
} from './helpers/load-fixture';
import { setup } from './setup';
import { find_triggers } from './utils/find-triggers';

expect.addSnapshotSerializer(cwd_serializer);

const runtime = get_runtime('example', false);
const tranpiled_runtime = get_runtime('example', true);

const pass_line = 1;
const fail_line = 7;
const value_line = 13;

const get_description_line = (line: number) => line + 3;

describe('#get_type_inference_or_diagnostic()', () => {
  it('should return diagnostic on fail line', () => {
    expect(
      runtime.get_type_inference_or_diagnostic(fail_line),
    ).toMatchSnapshot();
  });
  it('should return inference on non-fail line', () => {
    expect(
      runtime.get_type_inference_or_diagnostic(pass_line),
    ).toMatchSnapshot();
  });
});

describe('#get_type_inference_or_throw_diagnostic()', () => {
  it('should throw diagnostic on fail line', () => {
    expect(() =>
      runtime.get_type_inference_or_throw_diagnostic(fail_line),
    ).toThrowErrorMatchingSnapshot();
  });
  it('should return inference on non-fail line', () => {
    expect(
      runtime.get_type_inference_or_throw_diagnostic(pass_line),
    ).toMatchSnapshot();
  });
});

describe('#get_type_report()', () => {
  it('should return diagnostic report on fail line', () => {
    expect(runtime.get_type_report(fail_line)).toMatchSnapshot();
  });
  it('should return diagnostic report with description on fail line with description', () => {
    expect(
      runtime.get_type_report(get_description_line(fail_line)),
    ).toMatchSnapshot();
  });
  it('should return inference report on non-fail line', () => {
    expect(runtime.get_type_report(pass_line)).toMatchSnapshot();
  });
  it('should return inference report with description on non-fail line with description', () => {
    expect(
      runtime.get_type_report(get_description_line(pass_line)),
    ).toMatchSnapshot();
  });
  it('should return inference report on non-fail line with line info while transpiled', () => {
    expect(tranpiled_runtime.get_type_report(pass_line)).toMatchSnapshot();
  });
});

describe('#get_value_report()', () => {
  it('should return error message report for fail getter', () => {
    expect(
      runtime.get_value_report(value_line, () => {
        throw new Error('Example Error');
      }),
    ).toMatchSnapshot();
  });
  it('should return error message report with description on desciption line for fail getter', () => {
    expect(
      runtime.get_value_report(value_line, () => {
        throw new Error('Example Error');
      }),
    ).toMatchSnapshot();
  });
  it('should return formatted value report for non-fail getter', () => {
    expect(
      runtime.get_value_report(get_description_line(value_line), () => ({
        example: 'value',
      })),
    ).toMatchSnapshot();
  });
  it('should return formatted value report with description on desciption for non-fail getter', () => {
    expect(
      runtime.get_value_report(get_description_line(value_line), () => ({
        example: 'value',
      })),
    ).toMatchSnapshot();
  });
  it('should return formatted value report for non-fail getter with line info while transpiled', () => {
    expect(
      tranpiled_runtime.get_value_report(
        get_description_line(value_line),
        () => ({ example: 'value' }),
      ),
    ).toMatchSnapshot();
  });
});

function get_runtime(id: string, transpile: boolean) {
  const full_id = `runtime/${id}.ts`;
  const filename = get_fixture_filename(full_id);
  const source_file = load_fixture_source_file(full_id, ts);
  const triggers = find_triggers(source_file, ts);
  return setup(filename, { transpile }, triggers);
}
