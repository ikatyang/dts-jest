import * as ts from 'typescript';
import { create_source_file } from './create-source-file';
import { traverse_node } from './traverse-node';

const source = `

Math.max(1, 2, 3);

function abc() {
  console.log('something');
}

`;

it('should work correctly', () => {
  const source_file = create_source_file('something.ts', source, ts);

  const records: any[] = [];

  traverse_node(
    source_file,
    node => {
      records.push({
        kind: ts.SyntaxKind[node.kind],
        text: node.getText(),
      });
    },
    ts,
  );

  expect(records).toMatchSnapshot();
});
