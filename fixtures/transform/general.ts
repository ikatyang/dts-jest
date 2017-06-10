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
