export {};

declare const number_to_string: (v: number) => string;

// @dts-jest
number_to_string(1);

// @dts-jest:only
number_to_string(2);

// @dts-jest
number_to_string(3);
