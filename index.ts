import {
    Option,
    none,
    some,
    chain,
    getOrElse,
    map,
    flatten,
    ap
} from "fp-ts/lib/Option";

interface Lens<T, U> {
    get: (x: T) => Option<U>;
    getO: (x: Option<T>) => Option<U>;
    set: (x: T, b: U) => Option<T>;
    compose: <V>(lens: Lens<U, V>) => Lens<T, V>;
}

const lens = <T>() => <U>(
    g: (x: T) => U | undefined,
    s: (x: T, b: U) => T | undefined
): Lens<T, U> => {
    const get = (x: T) => {
        try {
            const r = g(x);
            return r ? some(r) : none;
        } catch {
            return none;
        }
    };

    const set = (x: T, a: U) => {
        try {
            const r = s(x, a);

            return r ? some(r) : none;
        } catch {
            return none;
        }
    };

    return {
        get,
        getO: x => chain(get)(x),
        set,
        compose: <V>(l: Lens<U, V>) =>
            lens<T>()(
                x =>
                    getOrElse<V | undefined>(() => undefined)(
                        chain(l.get)(get(x))
                    ),
                (x, c) => {
                    return getOrElse<T | undefined>(() => undefined)(
                        flatten(
                            map((b: U) => set(x, b))(
                                chain((t: U) => l.set(t, c))(get(x))
                            )
                        )
                    );
                }
            )
    };
};

interface B {
    c?: {
        d: number;
    };
}

interface X {
    a: number;
    b?: B;
}

const getProp = <T>() => <K extends keyof T>(k: K) => (x: T): T[K] => x[k];
const setProp = <T>() => <K extends keyof T>(k: K) => (x: T, b: T[K]) => ({
    ...x,
    [k]: b
});

const propLens = <T>() => <K extends keyof T>(
    k: K
): Lens<T, Exclude<T[K], undefined>> =>
    (lens<T>()(getProp<T>()(k), setProp<T>()(k)) as any) as Lens<
        T,
        Exclude<T[K], undefined>
    >;

interface User {
    name: Name;
}

interface Name {
    first: string;
    last?: string;
}

const user: User = {
    name: {
        first: "Alex",
        last: "Young"
    }
};

const liftA1 = <T, U>(f: (a: T) => U) => (a: Option<T>): Option<U> => map(f)(a);

const liftA2 = <T, U, V>(f: (a: T) => (b: U) => V) => (a: Option<T>) => (
    b: Option<U>
): Option<V> => {
    return ap(b)(map(f)(a));
};

const psi = <T, U>(f: (a: T) => (b: T) => U) => <V>(g: (a: V) => T) => (
    a: V
) => (b: V): U => f(g(a))(g(b));

const concat = (a: string) => (b: string) => a + b;
const lowercase = (s: string) => s.toLowerCase();

const username = psi(liftA2(concat))(liftA1(lowercase));

const nameL = propLens<User>()("name");
const firstL = nameL.compose(propLens<Name>()("first"));
const lastL = nameL.compose(propLens<Name>()("last"));

const getUsername = (user: User) => username(firstL.get(user))(lastL.get(user));

console.log({ u: getUsername(user) });
