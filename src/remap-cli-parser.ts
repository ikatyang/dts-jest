import yargs = require('yargs');
import { package_homepage, package_remap_bin } from './definitions';
import { RemapCliArguments, RemapCliOptions } from './remap-cli';

export const create_remap_cli_parser = () => {
  let parser = yargs
    .usage(
      `Usage: ${package_remap_bin} [--outDir <path>] [--rename <template>] <TestFileGlob> ...`,
    )
    .demandCommand(1)
    .epilogue(`Documentation: ${package_homepage}`);

  const options = get_cli_options();
  const special_options = {
    help: { alias: 'h' },
    version: { alias: 'v' },
  };

  const is_special_key = (key: string): key is keyof typeof special_options =>
    key in special_options;

  [...Object.keys(options), ...Object.keys(special_options)]
    .sort()
    .forEach(key => {
      parser = is_special_key(key)
        ? parser[key]().alias(key, special_options[key].alias)
        : parser.option(key, options[key as keyof RemapCliOptions]);
    });

  return parser.parse.bind(parser) as (argv: string[]) => RemapCliArguments;
};

function get_cli_options(): {
  [K in keyof RemapCliOptions]: {
    type: 'boolean' | 'string';
    alias: string;
    description: string;
  }
} {
  return {
    check: {
      alias: 'c',
      type: 'boolean',
      description:
        'Throw error if target content is different from output content',
    },
    listDifferent: {
      alias: 'l',
      type: 'boolean',
      description:
        'Print the filenames of files that their target content is different from output content',
    },
    outDir: {
      alias: 'o',
      type: 'string',
      description: 'Redirect output structure to the directory',
    },
    rename: {
      alias: 'r',
      type: 'string',
      description:
        'Rename output filename using template {{variable}}, available variable: filename, basename, extname',
    },
    typescript: {
      alias: 't',
      type: 'string',
      description: 'Specify which TypeScript source to use',
    },
  };
}
