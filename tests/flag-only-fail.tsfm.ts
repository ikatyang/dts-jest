export {};

declare const string_to_any: (v: string) => any;

// @dts-jest
string_to_any(1);

// @dts-jest:only:fail:snapshot
string_to_any(2);

// @dts-jest
string_to_any(3);
