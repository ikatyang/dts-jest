# dts-jest

[![npm](https://img.shields.io/npm/v/dts-jest.svg)](https://www.npmjs.com/package/dts-jest)
[![build](https://img.shields.io/travis/ikatyang/dts-jest/master.svg)](https://travis-ci.org/ikatyang/dts-jest/builds)
[![coverage](https://img.shields.io/codecov/c/github/ikatyang/dts-jest.svg)](https://codecov.io/gh/ikatyang/dts-jest)

A preprocessor for [Jest](https://facebook.github.io/jest/) to snapshot test [TypeScript declaration (.d.ts)](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) files

[Changelog](https://github.com/ikatyang/dts-jest/blob/master/CHANGELOG.md)

## Version

This project uses the same MAJOR.MINOR version as Jest.

## Installation

using npm

```sh
npm install --save-dev jest dts-jest
```

using yarn

```sh
yarn add --dev jest dts-jest
```

## Usage

Modify your [Jest config](https://facebook.github.io/jest/docs/en/configuration.html) so that looks something like:

(./package.json)

```json
{
  "scripts": {
    "test": "dts-jest & jest"
  },
  "jest": {
    "moduleFileExtensions": ["ts", "js"],
    "testRegex": "/dts-jest/.+\\.ts$",
    "transform": {"/dts-jest/.+\\.ts$": "dts-jest/transform"},
    "reporters": ["default", "dts-jest/reporter"]
  }
}
```

This setup allow you to test files `**/dts-jest/**/*.ts` via dts-jest.

**NOTE** If you want to use the `--config jest.json` option, make sure passing the same argument to `dts-jest` too, for example:

```sh
# pass --config option to dts-jest too
dts-jest --config ./jest.json & jest --config ./jest.json

# you don't have to pass other options
dts-jest --config ./jest.json & jest --config ./jest.json --watch
```

## Writing Tests

The test cases must start with `// @dts-jest`, and the second line should be an expression that you want to test its type.

**NOTE**: While testing, expression with error will snapshot its error message instead of its type.

(./dts-jest/example.ts)

```ts
declare const arrayify: <T extends string | number>(v: T) => T[];

// @dts-jest
arrayify('');

// @dts-jest:show
arrayify(true);

// @dts-jest optional-description
arrayify(0);
```

## Patterns

```ts
// @dts-jest[:flag] [description]
expression
```

- flags
  - default (aka [test](https://facebook.github.io/jest/docs/en/api.html#testname-fn))
  - `:skip` (aka [test.skip](https://facebook.github.io/jest/docs/en/api.html#testskipname-fn))
  - `:only` (aka [test.only](https://facebook.github.io/jest/docs/en/api.html#testonlyname-fn))
  - `:show` (aka `console.log`)
- description
  - default = expression

## Testing

It's recommended you to run Jest in watching mode via `--watch` flag.

```sh
npm run test -- --watch
```

**NOTE**: If you had changed the version of `dts-jest`, you might have to use `--no-cache` flag since Jest may use the older cache.

After running tests, you'll get the following result:

![pass](https://github.com/ikatyang/dts-jest/raw/master/images/pass.png)

Since snapshot testing will always pass and write the result at first time, it's reommended you to use flag `:show` to see the result first without writing results.

If you modify the function declaration to:

```ts
declare const arrayify: <T extends boolean>(v: T) => T[];
```

and test again, you'll get the following result:

![fail](https://github.com/ikatyang/dts-jest/raw/master/images/fail.png)

## Configs

Configs are in `_dts_jest_` field of Jest config `globals`.

There are several options

- tsconfig
  - default: `<rootDir>/tsconfig.json`
  - specify which *path of `tsconfig.json` (string)* or *compilerOptions (object)* to use
- server_port
  - default: `10086`
  - specify which port to use for the dts-jest server
- debug
  - default: `false`
  - print some messages for debugging

**NOTE**: paths are relative to `process.cwd()`

For example:

(./package.json)

```json
{
  "jest": {
    "globals": {
      "_dts_jest_": {
        "tsconfig": "path/to/tsconfig.json"
      }
    }
  }
}
```

## Development

```sh
# test
yarn run test

# test with coverage
yarn run test-coverage

# test actual behavior
yarn run test-integration

# build
yarn run build

# lint
yarn run lint
```

## Related

- [ts-jest](https://github.com/kulshekhar/ts-jest): A preprocessor to help use Typescript with Jest
- [typings-checker](https://github.com/danvk/typings-checker): Positive and negative assertions about TypeScript types and errors
