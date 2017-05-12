declare const expect_skip: () => {result: any};

// @dts-jest 1: expect
expect_skip();

// @dts-jest:skip 2: expect-skip
expect_skip();

// @dts-jest 3: expect
expect_skip();
