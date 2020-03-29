import { lens } from "./lens";

const updateArray = <T, U extends T[]>(k: number) => (x: U, a: T): U =>
    [...x.slice(0, k), a, ...x.slice(k + 1)] as U;

const updateObject = <T, K extends keyof T>(k: keyof T) => (
    x: T,
    a: T[K]
): T => ({
    ...x,
    [k]: a
});

export const fromProp = <T>() => <K extends keyof T>(k: K) =>
    lens<T>()(
        x => x[k],
        (x, a) =>
            (Array.isArray(x)
                ? updateArray<T[K], T[K][]>(k as number)(x, a)
                : updateObject<T, K>(k)(x, a)) as T
    );
