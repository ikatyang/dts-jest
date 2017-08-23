declare const T: any;

// other-comment

// @dts-jest
T.none();

// @dts-jest description-none
T.none();

// @dts-jest:show
T.show();

// @dts-jest:show description-show
T.show();

// @dts-jest:skip
T.skip();

// @dts-jest:skip description-skip
T.skip();

// @dts-jest:only
T.only();

// @dts-jest:only description-only
T.only();

{
  // @dts-jest
  T.in_block();
}

// @dts-jest:pass:snapshot
Math.abs(123);

// @dts-jest:fail:snapshot
Math.abs('abc');

// @dts-jest:test
T.test();

// @dts-jest:test description-test
T.test();

// @dts-jest:snapshot
T.shot();

// @dts-jest:snapshot description-shot
T.shot();

// @dts-jest:only:show description-only-show
T.only.show();
