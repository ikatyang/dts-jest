// @dts-jest:pass
Object.assign({
  a: 1,
}, {
  b: 2,
}, {
  c: 3,
}); //=> 123

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
