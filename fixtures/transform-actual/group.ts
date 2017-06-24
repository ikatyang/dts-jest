// @dts-jest:group A

// @dts-jest:show
Math.min(1, 2, 3); //=> 1

// @dts-jest:show description-show
Math.min(1, 2, 3); //=> 1

// @dts-jest:skip
Math.abs(-1); //=> 1

// @dts-jest:skip description-skip
Math.abs(-1); //=> 1

// @dts-jest:group:skip B

// @dts-jest:only
Math.floor(1.2); //=> 1

// @dts-jest:only description-only
Math.floor(1.2); //=> 1

// @dts-jest:pass
Math.abs(-2); //=> 2

// @dts-jest:group C

// @dts-jest:pass description-pass
Math.abs(-2); //=> 2

// @dts-jest:fail
Math.round(1.8); //=> 2

// @dts-jest:fail description-fail
Math.round(1.8); //=> 2

// @dts-jest
Math.max(
  1,
  2,
  3,
); //=> 3
