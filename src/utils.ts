import * as request from 'request';
import * as ts from 'typescript';
import {ServerPage} from './server';

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

export const request_server = (
    method: 'GET' | 'POST',
    port: number,
    page: ServerPage,
    args?: {},
    callback?: (body: string) => void) => {
  const url = `http://127.0.0.1:${port}${page}`;
  return request(
    url,
    {
      method,
      qs: args,
    },
    (error, response, body) => {
      // istanbul ignore next
      if (error || response.statusCode !== 200) {
        throw new Error(`Error: url=${url} method=${method} args=${JSON.stringify(args)} -> ${
          error
            ? error
            : `status=${response.statusCode}`
        }`);
      } else if (callback) {
        callback(body);
      }
    },
  );
};

// https://github.com/eslint/typescript-eslint-parser/blob/f5fcc87/lib/node-utils.js#L305
function is_token(node: ts.Node) {
  return node.kind >= ts.SyntaxKind.FirstToken && node.kind <= ts.SyntaxKind.LastToken;
}

// https://github.com/eslint/typescript-eslint-parser/blob/f5fcc87/lib/node-utils.js#L646
export function get_node_container(source_file: ts.SourceFile, start: number, end: number) {
  let container: null | ts.Node = null;
  (function walk(node: ts.Node) {
    const nodeStart = node.pos;
    const nodeEnd = node.end;
    if (start >= nodeStart && end <= nodeEnd) {
      if (is_token(node)) {
        container = node;
      } else {
        ts.forEachChild(node, walk);
      }
    }
  })(source_file);

  return container;
}
