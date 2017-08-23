export {};

declare const string_to_any: (v: string) => any;

// @dts-jest:snapshot
string_to_any('a');

// @dts-jest:only:pass:snapshot
string_to_any('b');

// @dts-jest:snapshot
string_to_any('c');
