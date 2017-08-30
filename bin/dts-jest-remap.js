#!/usr/bin/env node

var dts_jest = require('../lib/index');
var remap_cli_parser = dts_jest.create_remap_cli_parser();
var remap_cli_args = remap_cli_parser(process.argv.slice(2));

dts_jest.remap_cli(remap_cli_args);
