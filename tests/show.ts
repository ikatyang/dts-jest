declare const expect_show: () => {result: any};

// @dts-jest 1: expect
expect_show();

// @dts-jest:show 2: expect-show
expect_show();

// @dts-jest 3: expect
expect_show();
