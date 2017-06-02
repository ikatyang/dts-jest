declare const test_flag_show: (v: any) => {result: any};

// @dts-jest
test_flag_show(1);

// @dts-jest:show
test_flag_show(2);

// @dts-jest
test_flag_show(3);
