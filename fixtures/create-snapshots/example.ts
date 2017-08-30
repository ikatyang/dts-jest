// @dts-jest:pass
Math.max(1, 2, 3);

// @dts-jest:pass
Math.abs(-1);

// @dts-jest:pass
Math.abs('123');

// @dts-jest:pass
Object.assign<{ a: 1 }, { b: 2 }>({ c: 3 }, { d: 4 });
