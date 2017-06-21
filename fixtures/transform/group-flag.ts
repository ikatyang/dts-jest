declare const G: any;

// @dts-jest
G.normal();

// @dts-jest:group NamedGroup

// @dts-jest
G.in_named_group();

// @dts-jest:group

// @dts-jest
G.in_unnamed_group();

// @dts-jest:group:only OnlyGroup

// @dts-jest
G.in_only_group();

// @dts-jest:group:skip OnlyGroup

// @dts-jest
G.in_skip_group();
