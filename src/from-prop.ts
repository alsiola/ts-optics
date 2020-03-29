import { lens } from "./lens";

const updateArray = <T, U extends Array<T>>(k: number) => (x: U, a: T) => [
    ...x.slice(0, k),
    a,
    ...x.slice(k + 1)
];
const updateObject = <T, K extends keyof T>(k: keyof T) => (x: T, a: T[K]) => ({
    ...x,
    [k]: a
});

export const fromProp = <T>() => <K extends keyof T>(k: K) =>
    lens<T>()(
        x => x[k],
        (x, a) =>
            Array.isArray(x)
                ? updateArray<T[K], T[K][]>(k as number)(x, a)
                : (updateObject<T, K>(k)(x, a) as any)
    );
