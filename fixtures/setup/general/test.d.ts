type X<U> = {x: U};
interface I<T> {
  x: T;
}

declare const str: string;
declare const num: number;
declare const number_array: number[];
declare const overload_signature: {
  (): void;
  (): string;
};
declare const function_with_never: (v: never) => void;
declare const function_with_deep_never: (v: {v: never}) => void;
declare const function_with_generic_return_type_with_generic: <T>(v: T) => X<T>;
declare const function_with_generic_return_object_with_generic: <T>(v: T) => {x: T};
declare const function_with_generic_return_interface_with_generic: <T>(v: T) => I<T>;
declare const function_with_generics_return_union_with_generics: <T, U>(a: T, b: U) => T | U;
