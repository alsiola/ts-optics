import { Option, map, flatten } from "fp-ts/lib/Option";

export interface OptionLens<T, U> {
    get: (a: T) => Option<Exclude<U, undefined>>;
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
        set,
        modify: f => x => {
            const prop = get(x);

            const newProp = map(f)(prop);

            return flatten(map((np: U) => set(x, np))(newProp));
        },
        compose: l =>
            optionLens<T>()(
                x => flatten(map(l.get)(get(x))),
                (x, a) =>
                    flatten(
                        flatten(
                            map((gx: U) =>
                                map((nx: U) => set(x, nx))(l.set(gx, a))
                            )(get(x))
                        )
                    )
            ) as OptionLens<T, Exclude<any, undefined>>
    };
};
