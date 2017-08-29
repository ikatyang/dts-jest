import * as _ts from 'typescript';

// tslint:disable-next-line:no-var-requires
const package_json = require('../package.json');

export const package_name = package_json.name;
export const package_homepage = package_json.homepage;
export const package_remap_bin = Object.keys(package_json.bin)[0];

export const config_namespace = '_dts_jest_';
export const runtime_namespace = '_dts_jest_runtime_';

export const env_root_dir = 'DTS_JEST_ROOT_DIR';

export const runtime_indent_spaces = 2;

export const trigger_header_regex = /^\s*@dts-jest\b(:?\S*)\s*(.*)\s*$/;
export enum TriggerHeaderMatchIndex {
  Input,
  Flags,
  Description,
}

export const trigger_footer_regex = /^=>\s*([\s\S]*)\s*$/;
export enum TriggerFooterMatchIndex {
  Input,
  Value,
}

export enum TriggerHeaderFlags {
  ':snap' = 1 << 0,
  ':show' = 1 << 1,
  ':pass' = 1 << 2,
  ':fail' = 1 << 3,
  ':only' = 1 << 4,
  ':skip' = 1 << 5,
  ':group' = 1 << 6,
  Assertion = TriggerHeaderFlags[':snap'] |
    TriggerHeaderFlags[':show'] |
    TriggerHeaderFlags[':pass'] |
    TriggerHeaderFlags[':fail'],
}

export enum TriggerFooterFlag {
  Show = '?',
  Error = ':error',
  NoError = ':no-error',
}

export enum TestMethod {
  Test = 'test',
  Only = 'test.only',
  Skip = 'test.skip',
}

export enum GroupMethod {
  Test = 'describe',
  Only = 'describe.only',
  Skip = 'describe.skip',
}

export interface TriggerHeader {
  line: number;
  flags: TriggerHeaderFlags;
  method: TestMethod;
  description?: string;
  group?: TriggerGroup;
}

export interface TriggerBody {
  start: number;
  end: number;
  expression: string;
}

export interface TriggerFooter {
  line: number;
  flag?: TriggerFooterFlag;
  expected?: string;
}

export interface Trigger {
  header: TriggerHeader;
  body: TriggerBody;
  footer?: TriggerFooter;
}

export interface TriggerGroup {
  line: number;
  method: GroupMethod;
  description?: string;
}

export interface Snapshot {
  line: number;
  inference?: string;
  diagnostic?: string;
}

export interface JestConfig {
  rootDir: string;
  globals: { [K in typeof config_namespace]?: RawConfig };
}

export interface RawConfig {
  test_type?: boolean;
  test_value?: boolean;
  compiler_options?: string | Record<string, any>;
  enclosing_declaration?: boolean;
  type_format_flags?: _ts.TypeFormatFlags;
  typescript?: string;
}

export interface NormalizedConfig {
  test_type: boolean;
  test_value: boolean;
  compiler_options: _ts.CompilerOptions;
  enclosing_declaration: boolean;
  type_format_flags: _ts.TypeFormatFlags;
  typescript: typeof _ts;
  typescript_path: string;
}
