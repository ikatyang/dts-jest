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

export const request_server = (port: number, page: ServerPage, args?: {}, callback?: (body: string) => void) => {
  const url = `http://127.0.0.1:${port}${page}`;
  return request.get(
    url,
    {
      qs: args,
    },
    (error, response, body) => {
      // istanbul ignore next
      if (error || response.statusCode !== 200) {
        throw new Error(`Error: url=${url} args=${args} -> ${
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
