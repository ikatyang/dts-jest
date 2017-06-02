declare const snapshot_error: (v: {a: {b: {c: string}}}) => any;

// @dts-jest
snapshot_error(1);

// @dts-jest
snapshot_error({a: {b: 1}});

// @dts-jest
snapshot_error({a: {b: {c: 1}}});
