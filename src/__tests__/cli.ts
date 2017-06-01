jest.mock('../server');
jest.unmock('../cli');

import {run} from '../cli';
import {create_server} from '../server';

it('should create a server', () => {
  run([]);
  expect(create_server).toBeCalled();
});
