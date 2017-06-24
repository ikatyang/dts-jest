# Change Log

All changes to this project will be documented in this file.

> **Tags:**
> - 💥 [Breaking Change]
> - 🚀 [New Feature]
> - 🐛 [Bug Fix]
> - 📝 [Documentation]
> - 🏠 [Internal]
> - 💅 [Polish]

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
