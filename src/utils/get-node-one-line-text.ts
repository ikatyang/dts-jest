import * as _ts from 'typescript';

export const get_node_one_line_text = (
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
        // @ts-ignore
        delete cloned_node.pos;

        if (
          cloned_node.kind >= ts.SyntaxKind.FirstTemplateToken &&
          cloned_node.kind <= ts.SyntaxKind.LastTemplateToken &&
          'rawText' in cloned_node
        ) {
          // @ts-expect-error: hack for TypeScript 3.6+ (ref: https://github.com/microsoft/TypeScript/pull/32844)
          cloned_node.rawText = cloned_node.rawText.replace(/\n/g, '\\n');
        }

        return cloned_node;
      },
    },
  );

  return printer
    .printNode(ts.EmitHint.Unspecified, node, source_file)
    .replace(/\s*\n\s*/g, ' ')
    .replace(/;+$/, '');
};
