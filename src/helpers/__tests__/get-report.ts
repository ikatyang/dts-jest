jest.unmock('../get-report');

import {default_reporter_template} from '../../definitions';
import {get_report} from '../get-report';

const expression = '[expression]';
const snapshot = '[snapshot]';

it('should return correctly', () => {
  expect(get_report(default_reporter_template, expression, snapshot)).toMatchSnapshot();
});
