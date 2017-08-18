# dts-jest

[![npm](https://img.shields.io/npm/v/dts-jest.svg)](https://www.npmjs.com/package/dts-jest)
[![build](https://img.shields.io/travis/ikatyang/dts-jest/master.svg)](https://travis-ci.org/ikatyang/dts-jest/builds)
[![coverage](https://img.shields.io/codecov/c/github/ikatyang/dts-jest.svg)](https://codecov.io/gh/ikatyang/dts-jest)

A preprocessor for [Jest](https://facebook.github.io/jest/) to snapshot test [TypeScript declaration (.d.ts)](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) files

[Changelog](https://github.com/ikatyang/dts-jest/blob/master/CHANGELOG.md)

- [Version](#version)
- [Install](#install)
- [Usage](#usage)
- [Writing tests](#writing-tests)
- [Patterns](#patterns)
- [Testing](#testing)
- [Configs](#configs)
- [Actual Tests](#actual-tests)
- [Generate diff-friendly snapshots](#generate-diff-friendly-snapshots)
- [Developement](#development)
- [Related](#related)

## Install

using npm

```sh
npm install --save-dev dts-jest jest typescript
```

using yarn

```sh
yarn add --dev dts-jest jest typescript
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

#### Testing

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

#### Grouping

Test cases after this pattern will be marked as that group.

```ts
// @dts-jest:group[flags] [title]
```

- title
  - default: `'untitled'`
- flag
  - default: `:test`
  - `:test`: aka [`describe`](https://facebook.github.io/jest/docs/en/api.html#describename-fn)
  - `:only`: aka [`describe.only`](https://facebook.github.io/jest/docs/en/api.html#describeonlyname-fn)
  - `:skip`: aka [`describe.skip`](https://facebook.github.io/jest/docs/en/api.html#describeskipname-fn)

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

## Actual Tests

You can use `dts-jest/transform-actual` to test its actual results, for example:

(./package.json)

```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "moduleFileExtensions": ["ts", "js", "json"],
    "testRegex": "/dts-jest/.+\\.ts$",
    "transform": {"/dts-jest/.+\\.ts$": "dts-jest/transform-actual"}
  }
}
```

This transformer allows you to test its value via `//=> value` coment, the comment should be put on the end line of the expression.

```ts
// @dts-jest
Math.max(1, 2, 3); //=> 3

// @dts-jest
Math.max(
  1,
  2,
  3,
); //=> 3

const result = 3;
// @dts-jest
Math.max(
  1,
  2,
  3,
); //=> result
```

## Generate diff-friendly snapshots

Originally, snapshots and source content are in different files, it is hard to check their difference before/after, so here comes the `dts-jest-remap-snapshots` for generating diff-friendly snapshots.

(./example.ts)

```ts
// @dts-jest
Math.max(1, 2, 3);
```

(./`__snapshots__`/example.ts.snap) note this file is generated by Jest

```ts
// Jest Snapshot v1, https://goo.gl/fbAQLP
exports[`Math.max(1, 2, 3) 1`] = `"number"`;
```

This command will combine both snapshots and source content in one file:

```sh
dts-jest-remap-snapshot ./__snapshots__/example.ts.snap > path/to/your-generated-file.ts
```

(path/to/your-generated-file.ts)

```ts
// @dts-jest -> number
Math.max(1, 2, 3);
```

## Development

```sh
# test
yarn run test

# test with coverage
yarn run test -- --coverage

# try actual behavior
yarn run test-integration

# build
yarn run build

# lint
yarn run lint
```

## Related

- [ts-jest](https://github.com/kulshekhar/ts-jest): A preprocessor to help use Typescript with Jest
- [typings-checker](https://github.com/danvk/typings-checker): Positive and negative assertions about TypeScript types and errors
