// @dts-jest
'normal'; //=> 'normal'

// @dts-jest:group NamedGroup

// @dts-jest
'in_named_group'; //=> 'in_named_group'

// @dts-jest:group

// @dts-jest
'in_unnamed_group'; //=> 'in_unnamed_group'

// @dts-jest:group:only OnlyGroup

// @dts-jest
'in_only_group'; //=> 'in_only_group'

// @dts-jest:group:skip SkipGroup

// @dts-jest
'in_skip_group'; //=> 'in_skip_group'
