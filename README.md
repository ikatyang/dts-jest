# dts-jest

[![npm](https://img.shields.io/npm/v/dts-jest.svg)](https://www.npmjs.com/package/dts-jest)
[![build](https://img.shields.io/travis/ikatyang/dts-jest/master.svg)](https://travis-ci.org/ikatyang/dts-jest/builds)
[![coverage](https://img.shields.io/codecov/c/github/ikatyang/dts-jest.svg)](https://codecov.io/gh/ikatyang/dts-jest)

A preprocessor for [Jest](https://facebook.github.io/jest/) to snapshot test [TypeScript declaration (.d.ts)](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) files

[Changelog](https://github.com/ikatyang/dts-jest/blob/master/CHANGELOG.md)

## Version

This project uses the same MAJOR version as Jest.

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
    "test": "jest"
  },
  "jest": {
    "moduleFileExtensions": ["ts", "js", "json"],
    "testRegex": "/dts-jest/.+\\.ts$",
    "transform": {"/dts-jest/.+\\.ts$": "dts-jest/transform"}
  }
}
```

This setup allow you to test files `**/dts-jest/**/*.ts` via `dts-jest`.

## Writing Tests

The test cases must start with `// @dts-jest`, and the second line should be an expression that you want to test its type.

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
// @dts-jest[flags] [description]
expression
```

- description
  - default: expression
- flag
  - for test
    - default: `:test`
    - `:test`: aka [`test`](https://facebook.github.io/jest/docs/en/api.html#testname-fn)
    - `:only`: aka [`test.only`](https://facebook.github.io/jest/docs/en/api.html#testonlyname-fn)
    - `:skip`: aka [`test.skip`](https://facebook.github.io/jest/docs/en/api.html#testskipname-fn)
  - for assertion
    - default: `:shot`
    - `:shot`: aka `:pass` + `:fail`, snapshot its inferenced type or diagnostic message
    - `:show`: aka `console.log`
    - `:pass`: aka [`toMatchSnapshot`](https://facebook.github.io/jest/docs/en/expect.html#tomatchsnapshotoptionalstring)
    - `:fail`: aka [`toThrowErrorMatchingSnapshot`](https://facebook.github.io/jest/docs/en/expect.html#tothrowerrormatchingsnapshot)

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
  - default: `{}`
  - specify which *path of `tsconfig.json` (string)* or *compilerOptions (object)* to use
- type_format
  - default: `ts.TypeFormatFlags.NoTruncation`
  - specify type format

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
