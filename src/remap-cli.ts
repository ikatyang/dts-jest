import * as fs from 'fs';
import globby = require('globby');
import intersection = require('lodash.intersection');
import make_dir = require('make-dir');
import * as path from 'path';
import yargs = require('yargs');
import { package_homepage, package_remap_bin } from './definitions';
import { remap } from './remap';
import { get_typescript } from './utils/get-typescript';

export interface RemapCliOptions {
  check?: boolean;
  listDiff?: boolean;
  outDir?: string;
  rename?: string;
  typescript?: string;
}

export interface RemapCliArgs extends RemapCliOptions {
  _: string[];
}

const remap_cli_parser = get_argv_parser();

export const remap_cli = (argv: string[]): void => {
  // istanbul ignore next
  const {
    _: globs,
    check = false,
    listDiff: list_diff = false,
    outDir: output_directory,
    rename: rename_template,
    typescript: typescript_id,
  } = remap_cli_parser.parse(argv);

  const filepaths = globby.sync(globs, { absolute: true });

  if (filepaths.length === 0) {
    log('There is no matched file.');
    return;
  }

  const invalid_filepaths = get_invalid_filepaths(
    filepaths,
    output_directory,
    rename_template,
  );

  if (invalid_filepaths.length !== 0) {
    throw new Error(
      `Input and output filename cannot be the same:\n\n${invalid_filepaths
        .map(x => `  ${x}`)
        .join('\n')}\n\nConsider adjusting option: --outDir or --rename`,
    );
  }

  if (!check && output_directory !== undefined) {
    make_dir.sync(output_directory);
  }

  const { ts, ts_path } = get_typescript(typescript_id, '');

  log(`Using TypeScript v${ts.version} from ${ts_path}`);

  let is_check_success = true;

  filepaths.forEach(filepath => {
    const source_content = fs.readFileSync(filepath, 'utf8');

    const snapshot_filepath = get_snapshot_filepath(filepath);
    const snapshot_content = fs.readFileSync(snapshot_filepath, 'utf8');

    const output_filepath = get_output_filepath(
      filepath,
      output_directory,
      rename_template,
    );
    const output_content = remap(source_content, snapshot_content, {
      typescript: ts,
      source_filename: filepath,
    });

    if (check || list_diff) {
      const target_content = fs.readFileSync(output_filepath, 'utf8');

      if (output_content !== target_content) {
        if (check) {
          is_check_success = false;
        }

        if (list_diff) {
          log(output_filepath);
        }
      }
    }

    if (!check) {
      fs.writeFileSync(output_filepath, output_content);
    }
  });

  if (!is_check_success) {
    throw new Error(`Difference(s) detected`);
  }
};

function get_invalid_filepaths(
  filepaths: string[],
  output_directory?: string,
  rename_template?: string,
) {
  return intersection(
    filepaths,
    filepaths.map(filepath =>
      get_output_filepath(filepath, output_directory, rename_template),
    ),
  );
}

function get_output_filepath(
  filepath: string,
  output_directory?: string,
  rename_template?: string,
) {
  const redirect_dirpath =
    output_directory === undefined
      ? path.dirname(filepath)
      : path.resolve(output_directory);

  const renamed_filename = rename_filename(filepath, rename_template);

  return path.join(redirect_dirpath, renamed_filename);
}

function rename_filename(filepath: string, template?: string) {
  const filename = path.basename(filepath);

  if (template === undefined) {
    return filename;
  }

  const extname = path.extname(filepath);
  const basename = path.basename(filepath, extname);

  return template
    .replace('{{filename}}', filename)
    .replace('{{basename}}', basename)
    .replace('{{extname}}', extname.slice(1) /* remove leading dot */);
}

function get_snapshot_filepath(filepath: string) {
  return path.join(
    path.dirname(filepath),
    '__snapshots__',
    `${path.basename(filepath)}.snap`,
  );
}

function get_argv_parser() {
  let parser = yargs
    .usage(
      `Usage: ${package_remap_bin} [--outDir <path>] [--rename <template>] <TestFileGlob> ...`,
    )
    .demandCommand(1)
    .epilogue(`Documentation: ${package_homepage}`);

  const options = get_cli_options();

  ['help', 'version', ...Object.keys(options)].sort().forEach(key => {
    switch (key) {
      case 'help':
      case 'version':
        parser = parser[key]().alias(key, key[0]);
        break;
      default:
        parser = parser.option(key, options[key as keyof RemapCliOptions]);
        break;
    }
  });

  return parser;
}

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
      description: 'Throw error if target is different with output',
    },
    listDiff: {
      alias: 'l',
      type: 'boolean',
      description: 'Print filename if target is different with output',
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

function log(message: string) {
  // tslint:disable-next-line:no-console
  console.log(message);
}
