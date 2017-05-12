declare const _: any;

// @dts-jest
_('expect', 'no-description');

// @dts-jest:skip
_('expect-skip', 'no-description');

// @dts-jest:only
_('expect-only', 'no-description');

// @dts-jest [expect, description]
_('expect', 'description');

// @dts-jest:skip [expect-skip, description]
_('expect-skip', 'description');

// @dts-jest:only [expect-only, description]
_('expect-only', 'description');

// @dts-jest

_('invalid');
