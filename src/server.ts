import * as express from 'express';
import * as http from 'http';
import * as request from 'request';
import * as ts from 'typescript';
import {get_debug, get_server_port, get_tsconfig} from './config';
import {package_name, JestConfig, Snapshots, TriggerLines} from './definitions';
import {traverse_node} from './utils';

export class Server {

  public app: express.Express;
  public server: http.Server;
  public program: ts.Program;
  public compiler_options: ts.CompilerOptions;

  public last_reset: number = 0;
  public reseting: boolean = true;
  public callbacks: (() => void)[] = [];
  public debug: boolean;

  constructor(config: JestConfig) {
    this.app = express();
    this.init_app();

    const port = get_server_port(config);
    this.server = this.app.listen(port);

    this.debug = get_debug(config);
    this.compiler_options = get_tsconfig(config);

    this.log(`listening on port ${port}`);
  }

  public static request_pid(port: number, callback: (pid: number) => void) {
    request.get(`http://127.0.0.1:${port}/pid`, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        throw new Error(`Cannot get PID: ${
          error
            ? error
            : response.statusCode
        }`);
      } else {
        callback(+body);
      }
    });
  }

  public static request_snapshots(
      port: number,
      filename: string,
      trigger_lines: TriggerLines,
      callback: (snapshots: Snapshots) => void) {
    request.get(
      `http://127.0.0.1:${port}/snapshots`,
      {
        qs: {
          filename,
          lines: trigger_lines.join(','),
        },
      },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          callback({});
        } else {
          callback(JSON.parse(body));
        }
      },
    );
  }

  public static request_close(port: number) {
    request.get(`http://127.0.0.1:${port}/close`);
  }

  public static request_reset_mark(port: number) {
    request.get(`http://127.0.0.1:${port}/reset`);
  }

  public static request_reset_start(port: number, filenames: string[]) {
    request.get(`http://127.0.0.1:${port}/reset`, {
      qs: {
        filename: filenames,
      },
    });
  }

  public reset_program(filenames: string[]) {
    this.log(`reseting`);
    const old_program = this.program;
    this.callbacks = [];

    const current = Date.now();
    this.reseting = true;
    this.last_reset = current;

    setImmediate(() => {
      this.program = ts.createProgram(filenames, this.compiler_options, undefined, old_program);
      if (this.last_reset === current) {
        this.reseting = false;
        while (this.callbacks.length !== 0) {
          const callback = this.callbacks.pop();
          callback!();
        }
      }
    });
  }

  public init_app() {
    this.app.get('/snapshots', (request, response) => {
      const filename = (request.query.filename as string);
      const lines = (request.query.lines as string).split(',').map(str => +str);
      const callback = () => {
        const snapshots = get_snapshots(this.program, filename, lines);
        response.send(JSON.stringify(snapshots));
      };
      if (this.reseting) {
        this.callbacks.push(callback);
      } else {
        callback();
      }
    });
    this.app.get('/pid', (_, response) => {
      response.send(process.pid.toString());
    });
    this.app.get('/close', () => {
      this.close();
    });
    this.app.get('/reset', request => {
      const filename: undefined | string | string[] = request.query.filename;
      if (filename === undefined) {
        this.reseting = true;
      } else {
        if (typeof filename === 'string') {
          this.reset_program([filename]);
        } else {
          this.reset_program(filename);
        }
      }
    });
  }

  public close() {
    this.log(`closing`);
    this.server.close();
    process.exit(0);
  }

  private log(message: string) {
    if (this.debug) {
      // tslint:disable-next-line:no-console
      console.log(`[${package_name}] ${message}`);
    }
  }

}

export const create_server = (config: JestConfig) =>
  new Server(config);

function get_snapshots(program: ts.Program, source_filename: string, lines: number[]) {
  const source_file = program.getSourceFile(source_filename);
  const snapshots: Snapshots = {};

  const rest_lines = lines.slice();

  const diagnostics = ts.getPreEmitDiagnostics(program, source_file);
  for (const diagnostic of diagnostics) {
    // tslint:disable-next-line:no-unnecessary-type-assertion
    const position = diagnostic.start!;
    const {line: error_line} = source_file.getLineAndCharacterOfPosition(position);
    const trigger_line = error_line - 1;

    const line_index = rest_lines.indexOf(trigger_line);
    if (line_index !== -1) {
      snapshots[trigger_line] = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      rest_lines.splice(line_index, 1);
    }
  }

  const checker = program.getTypeChecker();
  traverse_node(source_file, node => {
    const position = node.getStart(source_file);
    const {line: expression_line} = source_file.getLineAndCharacterOfPosition(position);
    const trigger_line = expression_line - 1;

    const line_index = rest_lines.indexOf(trigger_line);
    if (line_index !== -1) {
      const target_node = node.getChildAt(0);
      const type = checker.getTypeAtLocation(target_node);
      snapshots[trigger_line] = checker.typeToString(type, node, ts.TypeFormatFlags.NoTruncation);
      rest_lines.splice(line_index, 1);
    }
  });

  return snapshots;
}
