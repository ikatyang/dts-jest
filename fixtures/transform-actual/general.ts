// @dts-jest
Math.max(1, 2, 3); //=> :no-error

// @dts-jest description-none
Math.max(1, 2, 3); //=> :no-error

// @dts-jest
Math.min(1, 2, 3); //=> ?

// @dts-jest description-show
Math.min(1, 2, 3); //=> ?

// @dts-jest:skip
Math.abs(-1); //=> :no-error

// @dts-jest:skip description-skip
Math.abs(-1); //=> :no-error

// @dts-jest:only
Math.floor(1.2); //=> :no-error

// @dts-jest:only description-only
Math.floor(1.2); //=> :no-error

// @dts-jest
Math.abs(-2); //=> 2

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
