export {};

declare const number_to_string: (v: number) => string;

// @dts-jest:show
number_to_string(1);

// @dts-jest:show optional-description
number_to_string(2);
