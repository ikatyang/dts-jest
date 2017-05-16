import {
  runtime_namespace,
  IRuntimeDescriptionParameters,
} from '../definitions';

export const get_description_expression = (line: number) => {
  const parameters: IRuntimeDescriptionParameters = {
    line,
  };
  return `${runtime_namespace}.description(${JSON.stringify(parameters)})`;
};
