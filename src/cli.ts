import {get_jest_configs} from './config';
import {create_server} from './server';

export const run = (argv: string[]) => {
  const {config} = get_jest_configs(argv);
  create_server(config);
};
