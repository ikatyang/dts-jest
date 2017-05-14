declare const test_title_description_1: () => {result: string};
declare const test_title_description_2: () => {result: number};
declare const test_title_description_3: () => {result: symbol};

// @dts-jest
test_title_description_1(

);

// @dts-jest
test_title_description_2();

// @dts-jest optional-description
test_title_description_3();
