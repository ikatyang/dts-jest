import pretty_format = require('pretty-format');
import { runtime_indent_spaces, Snapshot, Trigger } from './definitions';
import { get_trigger_body_line } from './utils/get-trigger-line';
import { indent } from './utils/indent';

interface RuntimeData {
  trigger: Trigger;
  snapshot?: Snapshot;
}

export class Runtime {
  private _data_map = new Map<number, RuntimeData>();

  constructor(triggers: Trigger[], snapshots: Snapshot[]) {
    triggers.forEach(trigger => {
      const body_line = get_trigger_body_line(trigger.header.line);
      this._data_map.set(body_line, { trigger });
    });
    snapshots.forEach(snapshot => {
      const data = this._data_map.get(snapshot.line)!;
      data.snapshot = snapshot;
    });
  }

  public get_type_inference_or_diagnostic(body_line: number) {
    const data = this._data_map.get(body_line)!;
    const snapshot = data.snapshot!;
    return snapshot.diagnostic !== undefined
      ? snapshot.diagnostic
      : snapshot.inference!;
  }

  public get_type_inference_or_throw_diagnostic(body_line: number) {
    const data = this._data_map.get(body_line)!;
    const snapshot = data.snapshot!;
    if (snapshot.diagnostic !== undefined) {
      throw new Error(snapshot.diagnostic);
    }
    return snapshot.inference!;
  }

  public get_type_report(body_line: number) {
    const { trigger } = this._data_map.get(body_line)!;

    try {
      return create_report(
        trigger,
        'Inferred',
        'to be',
        this.get_type_inference_or_throw_diagnostic(body_line),
      );
    } catch (error) {
      return create_report(
        trigger,
        'Inferring',
        'but throw',
        (error as Error).message,
      );
    }
  }

  public get_value_report(body_line: number, getter: () => any) {
    const { trigger } = this._data_map.get(body_line)!;

    try {
      return create_report(
        trigger,
        'Evaluated',
        'to be',
        pretty_format(getter()),
      );
    } catch (error) {
      return create_report(
        trigger,
        'Evaluating',
        'but throw',
        (error as Error).message,
      );
    }
  }
}

function create_report(
  trigger: Trigger,
  title1: string,
  title2: string,
  value: string,
) {
  const { header, body } = trigger;
  const description =
    header.description === undefined ? '' : `\n${header.description}\n`;

  const indented_expression = indent(body.expression, runtime_indent_spaces);
  const indented_value = indent(value, runtime_indent_spaces);

  return `${description}\n${title1}\n\n${indented_expression}\n\n${title2}\n\n${indented_value}\n`;
}
