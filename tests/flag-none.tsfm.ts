export {};

declare const number_to_string: (v: number) => string;

// @dts-jest:snapshot
number_to_string(1);

// @dts-jest:snapshot
number_to_string(2);

// @dts-jest:snapshot
number_to_string('x');
