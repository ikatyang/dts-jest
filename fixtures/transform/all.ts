// @dts-jest:pass
Math.max(1); //=> 1

// @dts-jest:group A

// @dts-jest:pass
Math.max(2); //=> 2

// @dts-jest:pass
Math.max(3); //=> 3

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
