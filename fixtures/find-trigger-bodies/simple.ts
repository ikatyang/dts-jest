// @dts-jest
Math.max(1, 2, 3);

// @dts-jest
Math.max(
  1,
  2,
  3,
);

(() => {
  // @dts-jest
  Math.max(1, 2, 3);
});


(() => {
  // @dts-jest
  Math.max(
    1,
    2,
    3,
  );
});
