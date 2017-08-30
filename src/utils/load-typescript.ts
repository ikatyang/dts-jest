import * as _ts from 'typescript';

export const load_typescript = (id: string = 'typescript') => {
  const typescript_path = require.resolve(id);
  const typescript = require(typescript_path) as typeof _ts;
  return { typescript, typescript_path };
};
