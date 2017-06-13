import * as dts from '../index';

it('should has transform', () => {
  expect(dts).toHaveProperty('transform');
});

it('should has setup', () => {
  expect(dts).toHaveProperty('setup');
});
