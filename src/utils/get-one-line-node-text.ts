import * as _ts from 'typescript';

export const get_one_line_node_text = (
  node: _ts.Node,
  source_file: _ts.SourceFile,
  ts: typeof _ts,
) => {
  const printer = ts.createPrinter(
    { removeComments: true },
    {
      substituteNode: (_hint, current_node) => {
        // let newlines in template string to be escaped
        const cloned_node = ts.getMutableClone(current_node);
        delete cloned_node.pos;
        return cloned_node;
      },
    },
  );

  return printer
    .printNode(ts.EmitHint.Unspecified, node, source_file)
    .replace(/\s*\n\s*/g, ' ')
    .replace(/;+$/, '');
};
