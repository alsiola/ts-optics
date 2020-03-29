import { Lens } from "./lens";
import { fromProp } from "./from-prop";

export const fromPath = <T>() => {
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
    function _fromPath<
        K1 extends keyof T,
        K2 extends keyof T[K1],
        K3 extends keyof T[K1][K2],
        K4 extends keyof T[K1][K2][K3]
    >(p1: K1, p2: K2, p3: K3, p4: K4): Lens<T, T[K1][K2][K3][K4]>;
    function _fromPath<
        K1 extends keyof T,
        K2 extends keyof T[K1],
        K3 extends keyof T[K1][K2],
        K4 extends keyof T[K1][K2][K3],
        K5 extends keyof T[K1][K2][K3][K4]
    >(p1: K1, p2: K2, p3: K3, p4: K4, p5: K5): Lens<T, T[K1][K2][K3][K4][K5]>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _fromPath(...ps: any[]) {
        return ps.slice(1).reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (l, p) => l.compose(fromProp<any>()(p)),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fromProp<any>()(ps[0])
        );
    }

    return _fromPath;
};
