import { parse_trigger_header_flags } from './parse-trigger-header-flags';

it('should parse correclty', () => {
  expect(parse_trigger_header_flags(':pass:snap')).toMatchSnapshot();
});

it('should throw error if there is a duplicate flag', () => {
  expect(() =>
    parse_trigger_header_flags(':fail:fail'),
  ).toThrowErrorMatchingSnapshot();
});

it('should throw error if there is an unexpected flag', () => {
  expect(() =>
    parse_trigger_header_flags(':unexpected'),
  ).toThrowErrorMatchingSnapshot();
});

it('should throw error if group flag and assertion flag appear simultaneously ', () => {
  expect(() =>
    parse_trigger_header_flags(':group:pass'),
  ).toThrowErrorMatchingSnapshot();
});

it('should throw error if pass flag and fail flag appear simultaneously ', () => {
  expect(() =>
    parse_trigger_header_flags(':pass:fail'),
  ).toThrowErrorMatchingSnapshot();
});
