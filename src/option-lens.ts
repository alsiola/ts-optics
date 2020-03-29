import { Option, map, flatten, getOrElse } from "fp-ts/lib/Option";

export interface OptionLens<T, U> {
    get: (a: T) => Option<Exclude<U, undefined>>;
    getOrElse: (a: T, b: U) => U;
    set: (a: T, b: U) => Option<Exclude<T, undefined>>;
    modify: (f: (a: U) => U) => (b: T) => Option<T>;
    compose: <V>(
        lens: OptionLens<U, V>
    ) => OptionLens<T, Exclude<V, undefined>>;
}

export const optionLens = <T>() => <U>(
    get: (a: T) => Option<Exclude<U, undefined>>,
    set: (a: T, b: U) => Option<Exclude<T, undefined>>
): OptionLens<T, U> => {
    return {
        get,
        getOrElse: (a, b) => getOrElse(() => b)(get(a)),
        set,
        modify: f => (x): Option<T> => {
            const prop = get(x);

            const newProp = map(f)(prop);

            return flatten(map((np: U) => set(x, np))(newProp));
        },
        compose: <V>(
            l: OptionLens<U, V>
        ): OptionLens<T, Exclude<V, undefined>> =>
            (optionLens<T>()(
                x => flatten(map(l.get)(get(x))),
                (x, a) =>
                    flatten(
                        flatten(
                            map((gx: U) =>
                                map((nx: U) => set(x, nx))(l.set(gx, a))
                            )(get(x))
                        )
                    )
            ) as unknown) as OptionLens<T, Exclude<V, undefined>>
    };
};
