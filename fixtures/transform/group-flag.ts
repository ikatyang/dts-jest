declare const G: any;

// @dts-jest:snapshot
G.normal();

// @dts-jest:group NamedGroup

// @dts-jest:snapshot
G.in_named_group();

// @dts-jest:group

// @dts-jest:snapshot
G.in_unnamed_group();

// @dts-jest:group:only OnlyGroup

// @dts-jest:snapshot
G.in_only_group();

// @dts-jest:group:skip SkipGroup

// @dts-jest:snapshot
G.in_skip_group();
