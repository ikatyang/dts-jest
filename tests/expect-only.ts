declare const expect_only: () => {result: any};

// @dts-jest 1: expect
expect_only();

// @dts-jest:only 2: expect-only
expect_only();

// @dts-jest 3: expect
expect_only();
