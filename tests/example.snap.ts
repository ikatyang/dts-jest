/** @dts-jest enable:test-value */

// @dts-jest:pass
Math.max(1); //=> 1

// @dts-jest:group A

// @dts-jest:pass:snap -> number
Math.max(2); //=> 2

// @dts-jest:fail:snap -> Argument of type 'string' is not assignable to parameter of type 'number'.
Math.max('123');

// @ts-expect-error:snap -> Argument of type 'string' is not assignable to parameter of type 'number'.
Math.max('456');

// @dts-jest:group B

// @dts-jest:show
Math.max(4); //=> ?

// @dts-jest:pass
Object.assign({
  a: 1,
}, {
  b: 2,
}, {
  c: 3,
}); /*=>
  {
    a: 1,
    b: 2,
    c: 3,
  }
*/

// @dts-jest:not-any
Math.max(5);
