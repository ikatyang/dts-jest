{
  // @dts-jest:group

  // @dts-jest
  Math.max(1, 2, 3);
}

// @dts-jest:group outside

// @dts-jest
Math.max(4, 5, 6);

{
  // @dts-jest:group inside

  // @dts-jest
  Math.max(7, 8, 9);
}
