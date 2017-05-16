jest.unmock('../setup');

import * as fs from 'fs';
import * as path from 'path';
import {
  IRuntimeMethods,
  ISelfConfig,
  ITriggerDescriptions,
} from '../definitions';
import {setup} from '../setup';

type IRuntimeInformation = {
  [T in keyof IRuntimeMethods]: any;
};

interface IRuntimeInformations {
  [line: number]: IRuntimeInformation;
}

const get_informations_from_setup_fixture = (
    fixture_relative_dirname: string,
    config: ISelfConfig = {},
    ): IRuntimeInformations => {
  const dirname = path.resolve(__dirname, fixture_relative_dirname);
  const filename = path.join(dirname, 'test.ts');
  const descriptions: ITriggerDescriptions = JSON.parse(
    fs.readFileSync(path.join(dirname, 'descriptions.json'), 'utf8'),
  );
  const runtime_methods = setup({filename}, config, descriptions);

  const lines = Object.keys(descriptions).map(line_str => +line_str);
  return lines.reduce<IRuntimeInformations>(
    (current_informations, line) =>
      ({
        ...current_informations,
        [line]: {
          report: runtime_methods.report({line}),
          snapshot: runtime_methods.snapshot({line}),
          description: runtime_methods.description({line}),
        },
      }),
    {},
  );
};

it('should setup correctly while all triggers are attachable', () => {
  expect(get_informations_from_setup_fixture('../../fixtures/setup/general')).toMatchSnapshot();
});

it('should throw error while unattachable trigger(s) existed', () => {
  expect(() => get_informations_from_setup_fixture('../../fixtures/setup/unattachable')).toThrowErrorMatchingSnapshot();
});

it('should setup correctly with type-detail = false', () => {
  expect(get_informations_from_setup_fixture('../../fixtures/setup/type-detail', {
    type_detail: false,
  })).toMatchSnapshot();
});

it('should setup correctly with type-detail = true', () => {
  expect(get_informations_from_setup_fixture('../../fixtures/setup/type-detail', {
    type_detail: true,
  })).toMatchSnapshot();
});
