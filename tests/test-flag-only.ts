declare const test_flag_only: (v: any) => {result: any};

// @dts-jest
test_flag_only(1);

// @dts-jest:only
test_flag_only(2);

// @dts-jest
test_flag_only(3);
