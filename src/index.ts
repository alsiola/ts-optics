import { Option, map, some, none, flatten } from "fp-ts/lib/Option";

export interface Lens<T, U> {
    get: (a: T) => U;
    set: (a: T, b: U) => T;
    modify: (f: (a: U) => U) => (b: T) => T;
    compose: <V>(lens: Lens<U, V>) => Lens<T, V>;
    asOptional: () => OptionLens<T, U>;
}

export interface OptionLens<T, U> {
    get: (a: T) => Option<Exclude<U, undefined>>;
    set: (a: T, b: U) => Option<Exclude<T, undefined>>;
    modify: (f: (a: U) => U) => (b: T) => Option<T>;
    compose: <V>(
        lens: OptionLens<U, V>
    ) => OptionLens<T, Exclude<V, undefined>>;
    asOptional: () => OptionLens<T, U>;
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
        asOptional: () =>
            optionLens<T>()<U>(
                x => get(x),
                (a, b) => set(a, b)
            ),
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

export const fromProp = <T>() => <K extends keyof T>(k: K) =>
    lens<T>()(
        x => x[k],
        (x, a) => ({ ...x, [k]: a })
    );

export function fromPath<T>() {
    function _fromPath<K1 extends keyof T>(p1: K1): Lens<T, T[K1]>;
    function _fromPath<K1 extends keyof T, K2 extends keyof T[K1]>(
        p1: K1,
        p2: K2
    ): Lens<T, T[K1][K2]>;
    function _fromPath<
        K1 extends keyof T,
        K2 extends keyof T[K1],
        K3 extends keyof T[K1][K2]
    >(p1: K1, p2: K2, p3: K3): Lens<T, T[K1][K2][K3]>;
    function _fromPath(...ps: any[]) {
        return ps
            .slice(1)
            .reduce(
                (l, p) => l.compose(fromProp<any>()(p)),
                fromProp<any>()(ps[0])
            );
    }

    return _fromPath;
}
