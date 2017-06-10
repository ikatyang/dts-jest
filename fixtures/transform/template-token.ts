import * as R from 'ramda';

{
  const f = {x: 'X', y: 'Y'};
  // @dts-jest
  R.keysIn(f); // => ['x', 'y']
}

{
  const f = {x: 'X', y: 'Y'};
  // @dts-jest
  R.keysIn(f); // => ['x', 'y']
}

class Point {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public toString() {
    return `new Point(${this.x}, ${this.y})`;
  }
}

// @dts-jest
R.toString(new Point(1, 2)); // => 'new Point(1, 2)'
