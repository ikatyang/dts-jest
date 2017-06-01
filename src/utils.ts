import * as ts from 'typescript';

export const traverse_node = (node: ts.Node, callback: (node: ts.Node) => void) => {
  if (node.kind !== ts.SyntaxKind.SourceFile) {
    callback(node);
  }
  ts.forEachChild(node, child => traverse_node(child, callback));
};

export const remove_spaces = (text: string) =>
  text.replace(/^\s+|\s+$|\n/mg, '');

export const defaults = <T>(value: undefined | T, default_value: T): T =>
  (value === undefined)
    ? default_value
    : value;
