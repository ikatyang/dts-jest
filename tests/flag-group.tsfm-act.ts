// @dts-jest
'normal'; //=> :no-error

// @dts-jest:group NamedGroup

// @dts-jest
'in_named_group'; //=> :no-error

// @dts-jest:group

// @dts-jest
'in_unnamed_group'; //=> :no-error

// @dts-jest:group:only OnlyGroup

// @dts-jest
'in_only_group'; //=> :no-error

// @dts-jest:group:skip SkipGroup

// @dts-jest
'in_skip_group'; //=> :no-error
