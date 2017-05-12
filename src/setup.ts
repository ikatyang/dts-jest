import * as ts from 'typescript';
import {ITrigger, ITSConfig} from './definitions';
import {load_compiler_options} from './utils/load-compiler-options';

export interface ISetupOptions {
  triggers: ITrigger[];
  tsconfig: ITSConfig;
  source_filename: string;
}

export const setup = (options: ISetupOptions) => {
  const {
    tsconfig,
    source_filename,
  } = options;
  const compiler_options = load_compiler_options(tsconfig, process.cwd());
  const program = ts.createProgram([source_filename], compiler_options);
  const source = program.getSourceFile(source_filename);
  const checker = program.getTypeChecker();

  const triggers = options.triggers.slice();
  const snapshots: {[line: number]: string} = {};

  // tslint:disable-next-line:only-arrow-functions
  (function collect_snapshot(node: ts.Node) {
    if (node.kind !== ts.SyntaxKind.SourceFile) {
      const position = node.getStart();
      const node_line = source.getLineAndCharacterOfPosition(position).line;
      for (let i = 0; i < triggers.length; i++) {
        const trigger_line: number = triggers[i].line;
        if (trigger_line + 1 === node_line) {
          const type = checker.getTypeAtLocation(node.getChildren()[0]);
          snapshots[trigger_line] = checker.typeToString(type);
          triggers.splice(i, 1);
          break;
        }
      }
    }
    ts.forEachChild(node, collect_snapshot);
  })(source);

  return (line: number) => snapshots[line];
};
