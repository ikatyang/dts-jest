// @dts-jest:group A

// @dts-jest
Math.min(1, 2, 3); //=> ?

// @dts-jest description-show
Math.min(1, 2, 3); //=> ?

// @dts-jest:skip
Math.abs(-1); //=> :no-error

// @dts-jest:skip description-skip
Math.abs(-1); //=> :no-error

// @dts-jest:group:skip B

// @dts-jest:only
Math.floor(1.2); //=> :no-error

// @dts-jest:only description-only
Math.floor(1.2); //=> :no-error

// @dts-jest:pass
Math.abs(-2); //=> 2

// @dts-jest:group C

// @dts-jest description-pass
Math.abs(-2); //=> 2

// @dts-jest
Math.round(1.8); //=> :error

// @dts-jest description-fail
Math.round(1.8); //=> :error

// @dts-jest
Math.max(
  1,
  2,
  3,
); //=> :no-error
