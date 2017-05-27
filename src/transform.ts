import {
  config_namespace,
  package_name,
  runtime_namespace,
  trigger_regex,
  TestMethod,
  Trigger,
  TriggerDescriptions,
  TriggerFlag,
  TriggerMatchArray,
  TriggerMatchIndex,
} from './definitions';

export const transform = (source_text: string) => {
  const source_line_texts = source_text.split('\n');

  const triggers = get_triggers(source_line_texts);
  const trigger_descriptions = create_trigger_descriptions(triggers);

  return triggers.reduce<string[]>(
    (transformed_line_texts, trigger) => {
      const index = trigger.line - 1;
      transformed_line_texts[index] += `${create_test_expression(trigger)};`;
      return transformed_line_texts;
    },
    source_line_texts.map((_, index) => (index !== 0) ? '' : `${create_setup_expression(trigger_descriptions)};`),
  ).join('\n');
};

function get_flag_and_method(flag: string): {flag: TriggerFlag, method: TestMethod} {
  switch (flag) {
    case TriggerFlag.None:
    case TriggerFlag.Show:
      return {flag, method: TestMethod.Test};
    case TriggerFlag.Skip:
      return {flag, method: TestMethod.Skip};
    case TriggerFlag.Only:
      return {flag, method: TestMethod.Only};
    default:
      throw new Error(`Unexpected flag ${JSON.stringify(flag)}`);
  }
}

function get_trigger(match: TriggerMatchArray, line: number): Trigger {
  const {flag, method} = get_flag_and_method(match[TriggerMatchIndex.Flag]);
  const description = match[TriggerMatchIndex.Description];
  return {
    line,
    flag,
    method,
    description,
  };
}

function get_triggers(source_line_texts: string[]): Trigger[] {
  return source_line_texts.reduce<Trigger[]>(
    (current_triggers, line_text, index) => {
      const match = line_text.match(trigger_regex);
      return (match === null)
        ? current_triggers
        : [
          ...current_triggers,
          get_trigger(match as TriggerMatchArray, index + 1),
        ];
    },
    [],
  );
}

function create_trigger_descriptions(triggers: Trigger[]): TriggerDescriptions {
  return triggers.reduce<TriggerDescriptions>(
    (current_descriptions, trigger) =>
      ({
        ...current_descriptions,
        [trigger.line]: (trigger.description === undefined)
          ? null
          : trigger.description,
      }),
    {},
  );
}

function create_setup_expression(trigger_descriptions: TriggerDescriptions) {
  const require_expression = `require(${JSON.stringify(package_name)})`;
  const config_expression = `(function () { try { return ${config_namespace}; } catch (e) { return {}; } })()`;
  const description_expression = JSON.stringify(trigger_descriptions);
  const setup_expression = `${require_expression}.setup(module, ${config_expression}, ${description_expression})`;
  return `var ${runtime_namespace} = ${setup_expression}`;
}

function create_test_expression(trigger: Trigger) {
  const description_expression = `${runtime_namespace}.description(${trigger.line})`;
  const snapshot_expression = `${runtime_namespace}.snapshot(${trigger.line})`;
  const assertion_expression = (trigger.flag === TriggerFlag.Show)
    ? `console.log(${snapshot_expression})`
    : `expect(${snapshot_expression}).toMatchSnapshot()`;
  return `${trigger.method}(${description_expression}, function () { ${assertion_expression}; })`;
}
