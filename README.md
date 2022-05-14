# dts-jest

[![npm](https://img.shields.io/npm/v/dts-jest.svg)](https://www.npmjs.com/package/dts-jest)
[![build](https://img.shields.io/travis/ikatyang/dts-jest/master.svg)](https://travis-ci.org/ikatyang/dts-jest/builds)
[![coverage](https://img.shields.io/codecov/c/github/ikatyang/dts-jest.svg)](https://codecov.io/gh/ikatyang/dts-jest)

A preprocessor for [Jest](https://facebook.github.io/jest/) to snapshot test [TypeScript declaration (.d.ts)](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) files

[Changelog](https://github.com/ikatyang/dts-jest/blob/master/CHANGELOG.md)

- [Install](#install)
- [Usage](#usage)
- [Writing Tests](#writing-tests)
- [Patterns](#patterns)
  - [Patterns for Testing](#patterns-for-testing)
  - [Patterns for Grouping](#patterns-for-grouping)
  - [Patterns for File-Level Config](#patterns-for-file-level-config)
- [Testing](#testing)
- [Configs](#configs)
- [Generate diff-friendly snapshots](#generate-diff-friendly-snapshots)
- [Reporter](#reporter)
- [FAQ](#faq)
- [Development](#development)
- [Related](#related)
- [License](#license)

## Install

```sh
# using npm
npm install --save-dev dts-jest jest typescript

# using yarn
yarn add --dev dts-jest jest typescript
```

- require `jest@>=27.0.0` and `typescript@>=2.3.0`

  | dts-jest | jest        |
  | -------- | ----------- |
  | >=25     | >=28        |
  | 24.x     | 27.x        |
  | 23.x     | 22.x ~ 26.x |

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

The test cases must start with a comment `@dts-jest`, and the next line should be an expression that you want to test its type or value.

(./dts-jest/example.ts)

```ts
// @dts-jest:pass:snap
Math.max(1);

// @dts-jest:pass
Math.min(1, 2, 3); //=> 1

// @dts-jest:fail:snap
Math.max('123');

// @ts-expect-error:snap
Math.max('123');
```

## Patterns

### Patterns for Testing

```ts
// @dts-jest[flags] [description]
expression //=> expected

// @ts-expect-error[flags] [description]
expression //=> expected
```

_Note:_ [`@ts-expect-error`](https://devblogs.microsoft.com/typescript/announcing-typescript-3-9-beta/#ts-expect-error-comments) is treated as an alias of `@dts-jest:fail` in `dts-jest`.

- description
  - optional
  - default: `expression`
- flag
  - optional
  - for test
    - default: [`test`](https://facebook.github.io/jest/docs/en/api.html#testname-fn)
    - `:only`: [`test.only`](https://facebook.github.io/jest/docs/en/api.html#testonlyname-fn)
    - `:skip`: [`test.skip`](https://facebook.github.io/jest/docs/en/api.html#testskipname-fn)
  - for type assertion
    - default: none
    - `:show`: `console.log(type)`
    - `:pass`: `expect(() => type)`[`.not`](https://facebook.github.io/jest/docs/en/expect.html#not)[`.toThrowError()`](https://facebook.github.io/jest/docs/en/expect.html#tothrowerror)
    - `:fail`: `expect(() => type)`[`.toThrowError()`](https://facebook.github.io/jest/docs/en/expect.html#tothrowerror)
    - `:snap`:
      - snapshot inferred type or diagnostic message
      - `expect(type)`[`.toMatchSnapshot()`](https://facebook.github.io/jest/docs/en/expect.html#tomatchsnapshotoptionalstring)
      - `expect(type)`[`.toThrowErrorMatchingSnapshot()`](https://facebook.github.io/jest/docs/en/expect.html#tothrowerrormatchingsnapshot)
    - `:not-any`: `expect(type)`[`.not`](https://facebook.github.io/jest/docs/en/expect.html#not)[`.toBe("any")`](https://facebook.github.io/jest/docs/en/expect.html#tobevalue)
- expected
  - optional
  - `//=> expected` or `/*=> expected */`
  - for value assertion
    - default: none
    - `?`: `console.log(value)`
    - `:error`: `expect(() => value)`[`.toThrowError()`](https://facebook.github.io/jest/docs/en/expect.html#tothrowerror)
    - `:no-error`: `expect(() => value)`[`.not`](https://facebook.github.io/jest/docs/en/expect.html#not)[`.toThrowError()`](https://facebook.github.io/jest/docs/en/expect.html#tothrowerror)
    - others: `expect(value)`[`.toEqual(expected)`](https://facebook.github.io/jest/docs/en/expect.html#toequalvalue)

### Patterns for Grouping

Test cases after this pattern will be marked as that group.

```ts
// @dts-jest:group[flag] [description]
```

If you need a block scope for your tests you can use a Block Statement.

```ts
// @dts-jest:group[flag] [description]
{
  // your tests
}
```

- description
  - default: `''`
- flag
  - default: [`describe`](https://facebook.github.io/jest/docs/en/api.html#describename-fn)
  - `:only`: [`describe.only`](https://facebook.github.io/jest/docs/en/api.html#describeonlyname-fn)
  - `:skip`: [`describe.skip`](https://facebook.github.io/jest/docs/en/api.html#describeskipname-fn)

### Patterns for File-Level Config

File-level config uses the first comment to set, only docblock will be detected.

```ts
/** @dts-jest [action:option] ... */
```

- action:
  - `enable`: set to `true`
  - `disable`: set to `false`
- option:
  - `test-type`: `test_type` option in [configs](#configs)
  - `test-value`: `test_value` option in [configs](#configs)

## Testing

It's recommended you to run Jest in watching mode via `--watch` flag.

```sh
npm run test -- --watch
```

**NOTE**: If you had changed the version of `dts-jest`, you might have to use `--no-cache` flag since Jest may use the older cache.

After running the [example tests](#writing-tests) with `npm run test`, you'll get the following result:

```text
 PASS  tests/example.ts
  Math.max(1)
    ✓ (type) should not throw error
    ✓ (type) should match snapshot
  Math.max('123')
    ✓ (type) should throw error
    ✓ (type) should match snapshot
  Math.min(1, 2, 3)
    ✓ (type) should not throw error

Snapshot Summary
 › 2 snapshots written in 1 test suite.

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   2 added, 2 total
Time:        0.000s
Ran all test suites.
```

Since snapshot testing will always pass and write the result at the first time, it's reommended you to use `:show` flag to see the result first without writing results.

(./dts-jest/example.ts)

```ts
// @dts-jest:pass:show
Math.max(1);

// @dts-jest:fail:show
Math.max('123');

// @dts-jest:pass
Math.min(1, 2, 3); //=> 1
```

```text
 PASS  dts-jest/example.ts
  Math.max(1)
    ✓ (type) should show report
    ✓ (type) should not throw error
  Math.max('123')
    ✓ (type) should show report
    ✓ (type) should throw error
  Math.min(1, 2, 3)
    ✓ (type) should not throw error

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.000s
Ran all test suites.

  console.log dts-jest/example.ts:2

    Inferred

      Math.max(1)

    to be

      number

  console.log dts-jest/example.ts:5

    Inferring

      Math.max('123')

    but throw

      Argument of type '"123"' is not assignable to parameter of type 'number'.
```

## Configs

Configs are in `_dts_jest_` field of Jest config `globals`.

There are several options

- test_type
  - default: `true`
  - enable type testing
  - [file-level config](#patterns-for-file-level-config) available
- test_value
  - default: `false`
  - enable value testing
  - [file-level config](#patterns-for-file-level-config) available
- enclosing_declaration
  - default: `false`
  - unwrap type alias
- typescript
  - default: `typescript` (node resolution)
  - specify which path of typescript to use
  - `<cwd>` available
- compiler_options
  - default: `{}`
  - specify which *path of `tsconfig.json` (string)* ~~or *compilerOptions (object)*~~ (deprecated, does not support `typeRoots` for _object_) to use
- type_format_flags
  - default: `ts.TypeFormatFlags.NoTruncation`
  - specify type format
- transpile
  - default: `true`
  - transpile code before testing, only affect tests that needs to test value
  - transpiling code will cause line number incorrect, it's better to disable this option if possible

For example:

(./package.json)

```json
{
  "jest": {
    "globals": {
      "_dts_jest_": {
        "compiler_options": {
          "strict": true,
          "target": "es6"
        }
      }
    }
  }
}
```

## Generate diff-friendly snapshots

Originally, snapshots and source content are in different files, it is hard to check their difference before/after, so here comes the `dts-jest-remap` for generating diff-friendly snapshots.

(./tests/example.ts)

```ts
// @dts-jest:snap
Math.max(1, 2, 3);
```

(./tests/`__snapshots__`/example.ts.snap) note this file is generated by Jest

```ts
// Jest Snapshot v1, https://goo.gl/fbAQLP
exports[`Math.max(1, 2, 3) 1`] = `"number"`;
```

This command will combine both snapshots and source content in one file:

```sh
dts-jest-remap ./tests/example.ts --outDir ./snapshots
```

(./snapshots/example.ts)

```ts
// @dts-jest:snap -> number
Math.max(1, 2, 3);
```

```text
Usage: dts-jest-remap [--outDir <path>] [--rename <template>] <TestFileGlob> ...

Options:
  --check, -c          Throw error if target content is different from output
                       content                                         [boolean]
  --help, -h           Show help                                       [boolean]
  --listDifferent, -l  Print the filenames of files that their target content is
                       different from output content                   [boolean]
  --outDir, -o         Redirect output structure to the directory       [string]
  --rename, -r         Rename output filename using template {{variable}},
                       available variable: filename, basename, extname  [string]
  --typescript, -t     Specify which TypeScript source to use           [string]
  --version, -v        Show version number                             [boolean]
```

## Reporter

If you'd like to know which typescript you are using, add `dts-jest/reporter` to your [Jest reporters](https://facebook.github.io/jest/docs/en/configuration.html#reporters-array-modulename-modulename-options), for example:

```json
{
  "reporters": [
    "default",
    "dts-jest/reporter"
  ]
}
```

It'll show the TS version and path after testing:

```text
[dts-jest] using TypeScript v0.0.0 from path/to/typescript
```

## FAQ

- `Compiler option 'lib' requires a value of type list`
  - Arrays in `jest` > `globals` > `_dts_jest_` will be transformed into objects.
  - Consider to use [`setupFiles`](https://facebook.github.io/jest/docs/en/configuration.html#setupfiles-array) to set configs (`globals._dts_jest_ = { ... }`).
  - See [jest#2093](https://github.com/facebook/jest/issues/2093) for details.
- `Debug Failure`
  - This is mostly caused by regex literal due to the printer bug [TypeScript#18071](https://github.com/Microsoft/TypeScript/issues/18071) (fixed in TS v2.6).
  - Workaround: use regex instance instead, e.g. `new RegExp('something')`.

## Development

```sh
# lint
yarn run lint

# test
yarn run test

# build
yarn run build
```

## Related

- [dtslint](https://github.com/Microsoft/dtslint): A utility built on TSLint for linting TypeScript declaration (.d.ts) files
- [typings-checker](https://github.com/danvk/typings-checker): Positive and negative assertions about TypeScript types and errors

## License

MIT © [Ika](https://github.com/ikatyang)
