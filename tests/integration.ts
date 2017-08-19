import * as child_process from 'child_process';

it(
  'should integrate correctly',
  done => {
    child_process.exec(
      'node_modules/.bin/jest --config ./fixtures/integration/jest.json --no-cache --verbose --runInBand',
      {},
      (_error, stdout, stderr) => {
        expect(
          `${remove_timestamps(stderr)}\n${remove_timestamps(stdout)}`,
        ).toMatchSnapshot();
        done();
      },
    );
  },
  60000,
);

function remove_timestamps(str: string) {
  return str
    .replace(/ \([0-9]+ms\)/g, '')
    .replace(/(Time: +)[0-9]+\.[0-9]+s/g, '$1unknown')
    .replace(/^\s+at[\s\S]+?\n\n/gm, '\n');
}
