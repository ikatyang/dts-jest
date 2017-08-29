// @dts-jest
Math.max(1, 2, 3); //=> 3

// @dts-jest
Math.max(1, 2, 3); //=> ?

// @dts-jest
Math.max(1, 2, 3); //=> :error

// @dts-jest
Math.max(1, 2, 3); //=> :no-error

// @dts-jest
Math.max(1, 2, 3); /*=> 3 */

// @dts-jest
Math.max(1, 2, 3); /*=> ? */

// @dts-jest
Math.max(1, 2, 3); /*=> :error */

// @dts-jest
Math.max(1, 2, 3); /*=> :no-error */
