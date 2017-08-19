import * as child_process from 'child_process';

it(
  'should integrate correctly',
  done => {
    child_process.exec(
      'node_modules/.bin/jest --config ./fixtures/integration/jest.json --no-cache --verbose',
      {},
      (_error, stdout, stderr) => {
        expect(
          remove_timestamps(
            `${remove_stack_tracing(sort_stderr(stderr))}\n${stdout}`,
          ),
        ).toMatchSnapshot();
        done();
      },
    );
  },
  60000,
);

function remove_timestamps(str: string) {
  return str
    .replace(/ \(([0-9]+\.)?[0-9]+m?s\)/g, '')
    .replace(/(Time: +)[0-9]+\.[0-9]+s/g, '$1unknown');
}

function remove_stack_tracing(str: string) {
  return str.replace(/^\s+at[\s\S]+?\n\n/gm, '\n');
}

function sort_stderr(str: string) {
  const title_summary_failing = 'Summary of all failing tests\n';
  const title_summary = 'Test Suites:';

  const offset_summary_failing = str.indexOf(title_summary_failing);
  const offset_summary = str.indexOf(title_summary);

  const results_1 = str.slice(0, offset_summary_failing);
  const results_2 = str.slice(
    offset_summary_failing + title_summary_failing.length,
    offset_summary,
  );

  return (
    sort_results(results_1) +
    title_summary_failing +
    sort_results(results_2) +
    str.slice(offset_summary)
  );
}

function sort_results(str: string) {
  return str
    .split(/( (?:PASS|FAIL) *(.+))/)
    .slice(1)
    .reduce<[string, string][]>((reduced, current, index, array) => {
      if (index % 3 !== 2) {
        return reduced;
      }
      const filename = array[index - 1];
      const separator = array[index - 2];
      return [...reduced, [filename, separator + current]];
    }, [])
    .sort(([filename1], [filename2]) => filename1.localeCompare(filename2))
    .map(([, content]) => content.replace(/\s+$/, '\n\n'))
    .join('');
}
