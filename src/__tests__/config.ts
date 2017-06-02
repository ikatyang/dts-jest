jest.mock('tsconfig-extends', () => ({
  load_file_sync: jest.fn(),
}));

import {load_file_sync} from 'tsconfig-extends';
import {get_tsconfig} from '../config';
import {jest_root_dir_placeholder} from '../definitions';

test('get_tsconfig() should replace <rootDir> correctly while tsconfig is string', () => {
  const root_dir = 'path/to/root';
  const tsconfig_path = 'tsconfig.json';
  get_tsconfig({
    rootDir: root_dir,
    globals: {
      _dts_jest_: {
        tsconfig: `${jest_root_dir_placeholder}/${tsconfig_path}`,
      },
    },
  } as any);
  expect(load_file_sync).toBeCalledWith(`${root_dir}/${tsconfig_path}`);
});
