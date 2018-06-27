# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="22.0.4"></a>
## [22.0.4](https://github.com/ikatyang/dts-jest/compare/v22.0.3...v22.0.4) (2018-06-27)


### Bug Fixes

* **deps:** update dependency yargs to ^9.0.0 ([#102](https://github.com/ikatyang/dts-jest/issues/102)) ([67be7f5](https://github.com/ikatyang/dts-jest/commit/67be7f5))
* support `typeRoots` ([#252](https://github.com/ikatyang/dts-jest/issues/252)) ([b918aa8](https://github.com/ikatyang/dts-jest/commit/b918aa8))



<a name="22.0.3"></a>
## [22.0.3](https://github.com/ikatyang/dts-jest/compare/v22.0.2...v22.0.3) (2017-09-05)


### Bug Fixes

* **deps:** update dependency pretty-format to ^21.0.0 ([#88](https://github.com/ikatyang/dts-jest/issues/88)) ([3721a48](https://github.com/ikatyang/dts-jest/commit/3721a48))
* **peerDeps:** accept jest ^21.0.0 ([#89](https://github.com/ikatyang/dts-jest/issues/89)) ([fc47496](https://github.com/ikatyang/dts-jest/commit/fc47496))



<a name="22.0.2"></a>
## [22.0.2](https://github.com/ikatyang/dts-jest/compare/v22.0.1...v22.0.2) (2017-09-04)


### Bug Fixes

* **options:** add `<cwd>` placeholder for `typescript` option to better describe its path ([#86](https://github.com/ikatyang/dts-jest/issues/86)) ([a003a31](https://github.com/ikatyang/dts-jest/commit/a003a31))



<a name="22.0.1"></a>
## [22.0.1](https://github.com/ikatyang/dts-jest/compare/v22.0.0...v22.0.1) (2017-09-01)


### Bug Fixes

* **runtime:** show 1-based line number ([#82](https://github.com/ikatyang/dts-jest/issues/82)) ([de4c6aa](https://github.com/ikatyang/dts-jest/commit/de4c6aa))



<a name="22.0.0"></a>
# [22.0.0](https://github.com/ikatyang/dts-jest/compare/v21.0.0...v22.0.0) (2017-08-31)


### Bug Fixes

* **deps:** jest peerDeps should allow ^20.0.0 ([1a24239](https://github.com/ikatyang/dts-jest/commit/1a24239))
* report unmatched diagnostic ([#52](https://github.com/ikatyang/dts-jest/issues/52)) ([4ab0f86](https://github.com/ikatyang/dts-jest/commit/4ab0f86))
* **deps:** update peerDeps typescript to ^2.3.0 ([c075dd2](https://github.com/ikatyang/dts-jest/commit/c075dd2))

### Features

* add ability to specify which typescript to use ([#49](https://github.com/ikatyang/dts-jest/issues/49)) ([9213bc1](https://github.com/ikatyang/dts-jest/commit/9213bc1))
* add reporter to show current TS version ([#51](https://github.com/ikatyang/dts-jest/issues/51)) ([bf4ee48](https://github.com/ikatyang/dts-jest/commit/bf4ee48))
* combine type and value tests ([#69](https://github.com/ikatyang/dts-jest/issues/69)) ([876b37d](https://github.com/ikatyang/dts-jest/commit/876b37d))
* redefine flags ([#54](https://github.com/ikatyang/dts-jest/issues/54)) ([dc1883f](https://github.com/ikatyang/dts-jest/commit/dc1883f))
* rewrite remap & remap-cli ([#59](https://github.com/ikatyang/dts-jest/issues/59)) ([1db5ea0](https://github.com/ikatyang/dts-jest/commit/1db5ea0))
* show detailed test title ([#74](https://github.com/ikatyang/dts-jest/issues/74)) ([2eac61f](https://github.com/ikatyang/dts-jest/commit/2eac61f))
* support `tsconfig.json` literal options ([#56](https://github.com/ikatyang/dts-jest/issues/56)) ([f9dd34a](https://github.com/ikatyang/dts-jest/commit/f9dd34a))


### BREAKING CHANGES

* **deps:** drop TS < v2.3
* **transform-actual:** remove transformer `transform-actual` as it currently combined with `transform`
* **remap:** [API] `remap(...)`
  * before
    * `snapshot_content`
      * allow `string` (raw content from *.snap)
      * allow `Record<string, string>` (unparsed content from *.snap)
  * after
    * `snapshot_content`
      * allow `string` (raw content from *.snap)
      * allow `Record<string, string>` (parsed content from *.snap)
* **remap-cli:** rename bin from `dts-jest-remap-snapshot` to `dts-jest-remap`
  * input using source file instead of snapshot file, e.g.
    * before: `./__snapshots__/example.ts.snap`
    * after: `./example.ts`
  * output content does not print to stdout now, use `--outDir` and `--rename` to specify output path instead
* **configs:** replace config value with config literal
  * Before
    ```json5
    {
      "target": 5 // ts.ScriptTarget.ESNext
    }
    ```
  * After
    ```json
    {
      "target": "esnext"
    }
    ```
* **flags:** redefine flag
  * type tests
    * `@dts-jest` -> `@dts-jest:snapshot`
    * `@dts-jest:snap` -> `@dts-jest:snapshot`
    * `@dts-jest:pass` -> `@dts-jest:pass:snapshot`
    * `@dts-jest:fail` -> `@dts-jest:fail:snapshot`
  * actual tests
    * `@dts-jest` + `//=> value` -> `//=> :no-error`
    * `@dts-jest:snap` + `//=> value` -> `//=> :no-error`
    * `@dts-jest:show` + `//=> value` -> `//=> ?`
    * `@dts-jest:pass` + `//=> value` -> `//=> value`
    * `@dts-jest:fail` + `//=> value` -> `//=> :error`

<a name="21.0.0"></a>
# [21.0.0](https://github.com/ikatyang/dts-jest/compare/v20.5.1...v21.0.0) (2017-08-18)


### Features

* **deps:** move typescript to peerDependecies ([#38](https://github.com/ikatyang/dts-jest/issues/38)) ([e9800f1](https://github.com/ikatyang/dts-jest/commit/e9800f1))


### BREAKING CHANGES

* **deps:** TypeScript now has to be installed manually so that you can choose which version to use

* **version:** This project now **DOES NOT** use the same versioning as Jest


## v20.5.1 (2017-06-30)

#### 🚀 New Feature
- allow using snapshot-content object for `remap-snapshot`
- allow specifying snapshot filename for `remap-snapshot` so as to handle cache

## v20.5.0 (2017-06-30)

#### 🚀 New Feature
- Add `remap-snapshot` to generate diff-friendly snapshots

## v20.4.1 (2017-06-24)

#### 🐛 Bug Fix
- Fix transpile error for actual test

## v20.4.0 (2017-06-24)

#### 🚀 New Feature
- Add actual test transformer (`dts-jest/transform-actual`) with `//=> value` comment

## v20.3.1 (2017-06-21)

#### 🐛 Bug Fix
- Fix indentation for description of grouped test

## v20.3.0 (2017-06-21)

#### 🚀 New Feature
- Add group flag to categorize test cases
- Add default flags ( `:test`, `:shot` ) to show its explicit flag
- Allow to set flags with any order, e.g. `:show:only`, `:only:show`

#### 🐛 Bug Fix
- Remove unnecessary leading spaces in expressions (dedent)

## v20.2.0 (2017-06-20)

#### 🚀 New Feature
- Add flags ( `:pass`, `:fail`, `:only:pass`, `:only:fail` ) to assert its result

## v20.1.0 (2017-06-13)

#### 💥 Breaking Change
- Use same MAJOR version as Jest
- Remove server since tests should be separated

#### 🚀 New Feature
- Add config `type_format`
- Display description in `:show`

## v20.0.6 (2017-06-10)

#### 🐛 Bug Fix
- Fix transforming for template token

## v20.0.4 (2017-06-09)

#### 🐛 Bug Fix
- Fix unexpected filenames

#### 🏠 Internal
- Use POST for modification actions

## v20.0.3 (2017-06-03)

#### 💥 Breaking Change
- setup a server for initializing TS source file at once
- remove useless config `type_detail`, `type_format`, `snapshot_formatter`

#### 🚀 New Feature
- allow to use `<rootDir>` in config `tsconfig`

## v20.0.2 (2017-05-16)

#### 🐛 Bug Fix
- Fix missing config

## v20.0.1 (2017-05-16)

#### 🚀 New Feature
- detect unattachable triggers
- allow to customize `:show` message with `reporter` option
- allow to customize inferred type with `type_detail` and `type_format` option
- allow to customize snapshot content with `snapshot_formatter` option

#### 🏠 Internal
- rewrite for better user experience about cache

## v20.0.0 (2017-05-14)

#### 🚀 New Feature
- Use same MAJOR.MINOR version as Jest

#### 📝 Documentation
- Fix image urls in README.md

## v1.0.5 (2017-05-13)

#### 🐛 Bug Fix
- Fix dependency

## v1.0.4 (2017-05-13)

#### 🚀 New Feature
- Release first version
