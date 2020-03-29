import { lens } from "./lens";

export const fromProp = <T>() => <K extends keyof T>(k: K) =>
    lens<T>()(
        x => x[k],
        (x, a) => ({ ...x, [k]: a })
    );
