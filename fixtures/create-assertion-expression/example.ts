// @dts-jest:pass:snap:show
Math.max(1, 2, 3); //=> 3

// @dts-jest:fail
Math.abs(-1); //=> ?

// @dts-jest
Math.cos(Math.PI); //=> :no-error

// @dts-jest
Math.tan(Math.PI); //=> :error

// @dts-jest:pass:snap:show
Math.sin(Math.PI); //=> ?

// @dts-jest:snap
Object.assign({ a: 1 }, { b: 2 }, { c: 3 }); /*=>
  {
    a: 1,
    b: 2,
    c: 3,
  }
*/

// @dts-jest
Math.min(3, 2, 1);

// @dts-jest:not-any
Math.min(3, 2, 1);
