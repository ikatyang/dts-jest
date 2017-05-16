jest.unmock('../index');

import * as dts_jest from '../index';

it('should export process', () => {
  expect(dts_jest).toHaveProperty('process');
});
