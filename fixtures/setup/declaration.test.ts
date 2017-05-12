// tslint:disable:no-unused-expression interface-over-type-literal

type X<U> = {x: U};
interface I<T> {
  x: T;
}

declare const a: number[];
declare const b: <T>(a: T) => I<T>;
declare const c: <T>(a: T) => X<T>;
declare const d: <T>(a: T) => {x: T};
declare const e: <T, U>(a: T, b: U) => T | U;
declare const f: {
  (): void;
  (): string;
};

a;
b;
c;
d;
e;
f;
a[0];
b(a);
c(a);
d(a);
e(1, '');
e(1, d);
f();
