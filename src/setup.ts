import * as ts from 'typescript';
import {ITrigger, ITSConfig} from './definitions';
import {indent} from './utils/indent';
import {load_compiler_options} from './utils/load-compiler-options';

export interface ISetupOptions {
  triggers: ITrigger[];
  tsconfig: ITSConfig;
  source_filename: string;
}

const find_trigger = (triggers: ITrigger[], target_line: number, fn: (trigger: ITrigger) => void) => {
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    if (trigger.line === target_line) {
      fn(trigger);
      triggers.splice(i, 1);
      break;
    }
  }
};

export const setup = (options: ISetupOptions) => {
  const {
    tsconfig,
    source_filename,
  } = options;
  const compiler_options = load_compiler_options(tsconfig, process.cwd());
  const program = ts.createProgram([source_filename], compiler_options);
  const source = program.getSourceFile(source_filename);
  const checker = program.getTypeChecker();
  const diagnostics = ts.getPreEmitDiagnostics(program);

  const snapshots: {[line: number]: string} = {};

  {
    const triggers = options.triggers.slice();
    // tslint:disable-next-line:only-arrow-functions
    (function collect_snapshot(node: ts.Node) {
      if (node.kind !== ts.SyntaxKind.SourceFile) {
        const position = node.getStart();
        const node_line = source.getLineAndCharacterOfPosition(position).line;
        find_trigger(triggers, node_line - 1, trigger => {
          const type = checker.getTypeAtLocation(node.getChildren()[0]);
          snapshots[trigger.line] = checker.typeToString(type);
        });
      }
      ts.forEachChild(node, collect_snapshot);
    })(source);
  }

  {
    const triggers = options.triggers.slice();
    for (const diagnostic of diagnostics) {
      const error_line = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line;
      find_trigger(triggers, error_line - 1, trigger => {
        snapshots[trigger.line] = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      });
    }
  }

  return {
    indent,
    snapshot: (line: number) => snapshots[line],
  };
};
