import * as _ts from 'typescript';

export const get_node_one_line_text = (
  node: _ts.Node,
  source_file: _ts.SourceFile,
  ts: typeof _ts,
) => {
  const printer = ts.createPrinter(
    { removeComments: true },
    {
      substituteNode: (_hint, current_node) =>
        ts.transform(current_node, [escape_newlines_in_template_node])
          .transformed[0],
    },
  );

  return printer
    .printNode(ts.EmitHint.Unspecified, node, source_file)
    .replace(/\s*\n\s*/g, ' ')
    .replace(/;+$/, '');

  function escape_newlines_in_template_node(
    context: _ts.TransformationContext,
  ) {
    return (node: _ts.Node) => {
      if (ts.isNoSubstitutionTemplateLiteral(node) && node.rawText) {
        return context.factory.createNoSubstitutionTemplateLiteral(
          node.text,
          escape_newlines(node.rawText),
        );
      }
      if (ts.isTemplateHead(node) && node.rawText) {
        return context.factory.createTemplateHead(
          node.text,
          escape_newlines(node.rawText),
          // @ts-expect-error: internal api
          node.templateFlags,
        );
      }
      if (ts.isTemplateMiddle(node) && node.rawText) {
        return context.factory.createTemplateMiddle(
          node.text,
          escape_newlines(node.rawText),
          // @ts-expect-error: internal api
          node.templateFlags,
        );
      }
      if (ts.isTemplateTail(node) && node.rawText) {
        return context.factory.createTemplateTail(
          node.text,
          escape_newlines(node.rawText),
          // @ts-expect-error: internal api
          node.templateFlags,
        );
      }
      return node;
    };
  }
};

function escape_newlines(raw_text: string) {
  // hack for TypeScript 3.6+ (ref: https://github.com/microsoft/TypeScript/pull/32844)
  return raw_text.replace(/\n/g, '\\n');
}
