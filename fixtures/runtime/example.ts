// @dts-jest:pass
Math.min(3, 2, 1);

// @dts-jest:pass description-pass
Math.min(3, 2, 1);

// @dts-jest:fail
Math.max('123');

// @dts-jest:fail description-fail
Math.max('123');

// @dts-jest
Math.max(1, 2, 3); //=> ?

// @dts-jest description-value
Math.max(1, 2, 3); //=> ?
