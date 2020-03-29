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

    it("composes and gets none for missing property", () => {
        const l = fromProp<Optional.User>()("address").asOptional();
        const m = fromProp<Optional.Address>()("city").asOptional();

        const n = l.compose(m);

        const actual = n.get(user);

        expect(actual).toEqual(none);
    });

    it("composes and gets none for missing property", () => {
        const l = fromProp<Optional.User>()("address").asOptional();
        const m = fromProp<Optional.Address>()("city").asOptional();

        const n = l.compose(m);

        const actual = n.get(Required.getUser());

        expect(actual).toEqual(some(Required.refUser.address.city));
    });
});
