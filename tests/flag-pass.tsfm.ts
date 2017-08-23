export {};

declare const string_to_any: (v: string) => any;

// @dts-jest:pass:snapshot
string_to_any('');

// @dts-jest:pass:snapshot
string_to_any(0);
