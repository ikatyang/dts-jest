import * as _ts from 'typescript';
import {
  docblock_option_regex,
  DocblockOptions,
  DocblockOptionMatchIndex,
  DocblockOptionValue,
  NormalizedConfig,
} from '../definitions';
import { for_each_comment } from './for-each-comment';

export const find_docblock_options = (
  source_file: _ts.SourceFile,
  ts: typeof _ts,
) => {
  const options: DocblockOptions = {};

  for_each_comment(
    source_file,
    comment => {
      if (!comment.startsWith('/**')) {
        return false;
      }

      const matched = comment.match(docblock_option_regex);

      if (matched === null) {
        return false;
      }

      const options_literal = matched[DocblockOptionMatchIndex.Options].trim();

      options_literal.split(/\s+/).forEach(option_value => {
        switch (option_value) {
          case DocblockOptionValue.EnableTestType:
            options.test_type = true;
            break;
          case DocblockOptionValue.EnableTestValue:
            options.test_value = true;
            break;
          case DocblockOptionValue.DisableTestType:
            options.test_type = false;
            break;
          case DocblockOptionValue.DisableTestValue:
            options.test_value = false;
            break;
          default:
            throw new Error(`Unexpected option value '${option_value}'`);
        }
      });

      return false;
    },
    ts,
  );

  return options;
};
