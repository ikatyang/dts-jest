// @dts-jest:snap -> (mocked max)
Math.max(3, 2, 1);

// @dts-jest:snap description-min -> (mocked min)
Math.min(3, 2, 1);

// @dts-jest:group A

// @dts-jest:snap -> (mocked abs)
Math.abs(3);

// @dts-jest:snap description-sin -> (mocked sin)
Math.sin(0);

// @dts-jest:group B

// @dts-jest:snap -> (mocked cos)
Math.cos(0);

// @dts-jest:snap -> (mocked tan 1)
Math.tan(0);

// @dts-jest:snap -> (mocked tan 2)
Math.tan(0);
