import * as fs from 'fs';
import globby = require('globby');
import intersection = require('lodash.intersection');
import make_dir = require('make-dir');
import * as path from 'path';
import { remap } from './remap';
import { create_message } from './utils/create-message';
import { create_typescript_info } from './utils/create-typescript-info';
import { load_typescript } from './utils/load-typescript';

export interface RemapCliOptions {
  check?: boolean;
  listDifferent?: boolean;
  outDir?: string;
  rename?: string;
  typescript?: string;
}

export interface RemapCliArguments extends RemapCliOptions {
  _: string[];
}

export const remap_cli = (args: RemapCliArguments): void => {
  // istanbul ignore next
  const {
    _: globs,
    check = false,
    listDifferent: list_different = false,
    outDir: output_directory,
    rename: rename_template,
    typescript: typescript_id,
  } = args;

  const source_filenames = globby.sync(globs, { absolute: true });
  const logger = create_logger();

  if (source_filenames.length === 0) {
    logger.log('There is no matched file.');
    return;
  }

  const invalid_filenames = get_invalid_filenames(
    source_filenames,
    output_directory,
    rename_template,
  );

  if (invalid_filenames.length !== 0) {
    throw new Error(
      create_message(
        'Input and output filename cannot be the same:',
        invalid_filenames,
        'Consider adjusting option `--outDir` or `--rename` to redirect output',
      ),
    );
  }

  if (!check && output_directory !== undefined) {
    make_dir.sync(output_directory);
  }

  const { typescript: ts, typescript_path } = load_typescript(typescript_id);

  logger.log(create_typescript_info(ts.version, typescript_path));

  interface Different {
    source_filename: string;
    output_filename: string;
  }
  const differents: Different[] = [];

  source_filenames.forEach(source_filename => {
    const source_content = fs.readFileSync(source_filename, 'utf8');

    const snapshot_filename = get_snapshot_filename(source_filename);
    const snapshot_content = fs.readFileSync(snapshot_filename, 'utf8');

    const output_filename = get_output_filename(
      source_filename,
      output_directory,
      rename_template,
    );
    const output_content = remap(source_content, snapshot_content, {
      typescript: ts,
      source_filename,
    });

    if (check || list_different) {
      let target_content: string | undefined;

      try {
        target_content = fs.readFileSync(output_filename, 'utf8');
      } catch (e) {
        target_content = undefined;
      }

      if (output_content !== target_content) {
        differents.push({ source_filename, output_filename });
      }
    }

    if (!check) {
      fs.writeFileSync(output_filename, output_content);
    }
  });

  if (differents.length === 0) {
    return;
  }

  const erorr_message = 'Difference(s) detected';

  if (check && !list_different) {
    throw new Error(erorr_message);
  }

  const message = create_message(
    'Listing files that their target content is different from output content:',
    differents.map(
      different =>
        `${different.source_filename} -> ${different.output_filename}`,
    ),
    check ? erorr_message : undefined,
  );

  if (check) {
    throw new Error(message);
  }

  logger.log(message);
};

function get_invalid_filenames(
  filenames: string[],
  output_directory?: string,
  rename_template?: string,
) {
  return intersection(
    filenames,
    filenames.map(filepath =>
      get_output_filename(filepath, output_directory, rename_template),
    ),
  );
}

function get_output_filename(
  filename: string,
  output_directory?: string,
  rename_template?: string,
) {
  const redirect_dirpath =
    output_directory === undefined
      ? path.dirname(filename)
      : path.resolve(output_directory);

  const renamed_filename = rename_filename(filename, rename_template);

  return path.join(redirect_dirpath, renamed_filename);
}

function rename_filename(filename: string, template?: string) {
  const base_filename = path.basename(filename);

  if (template === undefined) {
    return base_filename;
  }

  const extname = path.extname(filename);
  const basename = path.basename(filename, extname);

  return template
    .replace('{{filename}}', base_filename)
    .replace('{{basename}}', basename)
    .replace('{{extname}}', extname.slice(1) /* remove leading dot */);
}

function get_snapshot_filename(filename: string) {
  return path.join(
    path.dirname(filename),
    '__snapshots__',
    `${path.basename(filename)}.snap`,
  );
}

// tslint:disable:no-console
function create_logger() {
  return new class {
    public counter = 0;
    public log(message: string) {
      if (this.counter++ !== 0) {
        console.log('');
      }
      console.log(message);
    }
  }();
}
// tslint:enable:no-console
