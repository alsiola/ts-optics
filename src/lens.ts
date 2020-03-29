import { OptionLens, optionLens } from "./option-lens";
import { none, some, Option } from "fp-ts/lib/Option";

export interface Lens<T, U> {
    get: (a: T) => U;
    set: (a: T, b: U) => T;
    modify: (f: (a: U) => U) => (b: T) => T;
    compose: <V>(lens: Lens<U, V>) => Lens<T, V>;
    asOptional: () => OptionLens<T, U>;
}

export const lens = <T>() => <U>(
    get: (a: T) => U,
    set: (a: T, b: U) => T
): Lens<T, U> => {
    return {
        get,
        set,
        modify: f => a => set(a, f(get(a))),
        asOptional: () => {
            const oGet = (x: T) => {
                const r = get(x);
                return typeof r === "undefined"
                    ? none
                    : (some(r) as Option<Exclude<U, undefined>>);
            };

            return optionLens<T>()(
                oGet,
                (x, a) =>
                    (some(set(x, a)) as any) as Option<Exclude<T, undefined>>
            );
        },
        compose: l =>
            lens<T>()(
                x => l.get(get(x)),
                (x, a) => set(x, l.set(get(x), a))
            )
    };
};
