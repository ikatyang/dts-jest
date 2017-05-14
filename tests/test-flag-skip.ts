declare const test_flag_skip: (v: any) => {result: any};

// @dts-jest
test_flag_skip(1);

// @dts-jest:skip
test_flag_skip(2);

// @dts-jest
test_flag_skip(3);
