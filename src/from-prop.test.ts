import { User, getUser, refUser } from "./__fixtures__/user";
import { fromProp } from "./from-prop";

describe("fromProp", () => {
    let user: User;

    beforeEach(() => {
        user = getUser();
    });

    it("gets a property", () => {
        const l = fromProp<User>()("name");

        const actual = l.get(user);

        expect(actual).toBe(refUser.name);
    });

    it("sets a property", () => {
        const l = fromProp<User>()("name");

        const actual = l.set(user, "Steve");

        expect(actual.name).toBe("Steve");
    });

    it("does not mutate when setting", () => {
        const l = fromProp<User>()("name");

        l.set(user, "Steve");

        expect(user.name).toBe(refUser.name);
    });

    it("composes getters", () => {
        const l = fromProp<User>()("address");

        const l2 = fromProp<User["address"]>()("city");

        const l3 = l.compose(l2);

        const actual = l3.get(user);

        expect(actual).toBe(refUser.address.city);
    });

    it("composes setters", () => {
        const l = fromProp<User>()("address");

        const l2 = fromProp<User["address"]>()("city");

        const l3 = l.compose(l2);

        const actual = l3.set(user, "Newcastle");

        expect(actual.address.city).toBe("Newcastle");
    });

    it("composes setters without mutation", () => {
        const l = fromProp<User>()("address");

        const l2 = fromProp<User["address"]>()("city");

        const l3 = l.compose(l2);

        l3.set(user, "Newcastle");

        expect(user.address.city).toBe(refUser.address.city);
    });

    it("modifies using an updater", () => {
        const l = fromProp<User>()("name");

        const updater = l.modify(n => n.toUpperCase());

        const actual = updater(user);

        expect(actual.name).toBe(refUser.name.toUpperCase());
    });
});
