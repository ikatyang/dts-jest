import * as express from 'express';
import * as http from 'http';
import * as request from 'request';
import * as ts from 'typescript';
import {get_debug, get_server_port, get_tsconfig} from './config';
import {package_name, JestConfig, Snapshots, TriggerLines} from './definitions';
import {get_snapshots, request_server} from './utils';

export enum ServerPage {
  Snapshots = '/snapshots',
  Close = '/close',
  PID = '/pid',
  Reset = '/reset',
}

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

  public static request_close(port: number) {
    return request_server(port, ServerPage.Close);
  }

  public static request_reset_mark(port: number) {
    return request_server(port, ServerPage.Reset);
  }

  public static request_reset_start(port: number, filenames: string[]) {
    return request_server(port, ServerPage.Reset, {filename: filenames});
  }

  public static request_pid(port: number, callback: (pid: number) => void) {
    return request_server(port, ServerPage.PID, undefined, body => {
      callback(+body);
    });
  }

  public static request_snapshots(
      port: number,
      filename: string,
      trigger_lines: TriggerLines,
      callback: (snapshots: Snapshots) => void) {
    request_server(
      port,
      ServerPage.Snapshots,
      {
        filename,
        lines: trigger_lines.join(','),
      },
      body => {
        callback(JSON.parse(body));
      },
    );
  }

  public reset_program(filenames: string[]) {
    this.log(`reseting`);
    const old_program = this.program;
    this.callbacks = [];

    const current = Date.now();
    this.reseting = true;
    this.last_reset = current;

    setImmediate(() => {
      const program = ts.createProgram(filenames, this.compiler_options, undefined, old_program);
      if (this.last_reset === current) {
        this.program = program;
        this.reseting = false;
        while (this.callbacks.length !== 0) {
          const callback = this.callbacks.pop();
          callback!();
        }
      }
    });
  }

  public init_app() {
    this.app.get(ServerPage.Snapshots, (request, response) => {
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
    this.app.get(ServerPage.PID, (_, response) => {
      response.send(process.pid.toString());
    });
    this.app.get(ServerPage.Close, () => {
      this.close();
    });
    this.app.get(ServerPage.Reset, request => {
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

  public log(message: string) {
    if (this.debug) {
      // tslint:disable-next-line:no-console
      console.log(`[${package_name}] ${message}`);
    }
  }

}

export const create_server = (config: JestConfig) =>
  new Server(config);
