import * as _ts from 'typescript';

export const traverse_node = (
  node: _ts.Node,
  callback: (node: _ts.Node) => void,
  ts: typeof _ts,
) => {
  if (node.kind !== ts.SyntaxKind.SourceFile) {
    callback(node);
  }
  ts.forEachChild(node, child => traverse_node(child, callback, ts));
};
