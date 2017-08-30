// @dts-jest:group A

// @dts-jest:pass:snap
Math.max(1, 2, 3); //=> 3

// @dts-jest:fail
Math.abs(-1); //=> ?

// @dts-jest:group B

// @dts-jest
Math.cos(Math.PI);

// @dts-jest
Object.assign({ a: 1 }, { b: 2 }, { c: 3 }); /*=>
  {
    a: 1,
    b: 2,
    c: 3,
  }
*/
