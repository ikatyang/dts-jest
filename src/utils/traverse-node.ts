import * as ts from 'typescript';

export const traverse_node = (
  node: ts.Node,
  callback: (node: ts.Node) => void,
) => {
  if (node.kind !== ts.SyntaxKind.SourceFile) {
    callback(node);
  }
  ts.forEachChild(node, child => traverse_node(child, callback));
};
