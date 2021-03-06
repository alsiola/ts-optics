import { lens } from ".";
import { Optional, Required } from "./__fixtures__/user";
import { some, none } from "fp-ts/lib/Option";
import { fromProp } from "./from-prop";

describe("optionLens", () => {
    let user: Optional.User;

    beforeEach(() => {
        user = Optional.getUser();
    });

    it("gets a property", () => {
        const l = lens<Optional.User>()(
            u => u.name,
            (u, name) => ({ ...u, name })
        ).asOptional();

        const actual = l.get(user);

        expect(actual).toEqual(some(Optional.refUser.name));
    });

    it("getOrElse gets unwrapped property", () => {
        const l = lens<Optional.User>()(
            u => u.name,
            (u, name) => ({ ...u, name })
        ).asOptional();

        const actual = l.getOrElse(user, "fallback");

        expect(actual).toEqual(Optional.refUser.name);
    });

    it("getOrElse gets a default for missing property", () => {
        const l = fromProp<Optional.User>()("address").asOptional();
        const m = fromProp<Optional.Address>()("city").asOptional();

        const n = l.compose(m);

        const actual = n.getOrElse(user, "fallback");

        expect(actual).toEqual("fallback");
    });

    it("composes and gets none for missing property", () => {
        const l = fromProp<Optional.User>()("address").asOptional();
        const m = fromProp<Optional.Address>()("city").asOptional();

        const n = l.compose(m);

        const actual = n.get(user);

        expect(actual).toEqual(none);
    });

    it("composes and gets property for missing property", () => {
        const l = fromProp<Optional.User>()("address").asOptional();
        const m = fromProp<Optional.Address>()("city").asOptional();

        const n = l.compose(m);

        const actual = n.getOrElse(user, "fallback");

        expect(actual).toEqual("fallback");
    });

    it("composes and gets some for present property", () => {
        const l = fromProp<Optional.User>()("address").asOptional();
        const m = fromProp<Optional.Address>()("city").asOptional();

        const n = l.compose(m);

        const actual = n.get(Required.getUser());

        expect(actual).toEqual(some(Required.refUser.address.city));
    });

    it("modifies and gets none for missing property", () => {
        const l = fromProp<Optional.User>()("address").asOptional();
        const m = fromProp<Optional.Address>()("city").asOptional();

        const n = l.compose(m).modify(s => s.toUpperCase());

        const actual = n(user);

        expect(actual).toEqual(none);
    });

    it("composes and gets some for present property", () => {
        const l = fromProp<Optional.User>()("address").asOptional();
        const m = fromProp<Optional.Address>()("city").asOptional();

        const n = l.compose(m).modify(s => s.toUpperCase());

        const actual = n(Required.getUser());

        expect(actual).toEqual(
            some({
                ...Required.refUser,
                address: {
                    ...Required.refUser.address,
                    city: Required.refUser.address.city.toUpperCase()
                }
            })
        );
    });
});
