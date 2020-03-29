import { lens } from ".";
import { Required } from "./__fixtures__/user";

describe("lens", () => {
    let user: Required.User;

    beforeEach(() => {
        user = Required.getUser();
    });

    it("gets a property", () => {
        const l = lens<Required.User>()(
            u => u.name,
            (u, name) => ({ ...u, name })
        );

        const actual = l.get(user);

        expect(actual).toBe(Required.refUser.name);
    });

    it("sets a property", () => {
        const l = lens<Required.User>()(
            u => u.name,
            (u, name) => ({ ...u, name })
        );

        const actual = l.set(user, "Steve");

        expect(actual.name).toBe("Steve");
    });

    it("does not mutate when setting", () => {
        const l = lens<Required.User>()(
            u => u.name,
            (u, name) => ({ ...u, name })
        );

        l.set(user, "Steve");

        expect(user.name).toBe(Required.refUser.name);
    });

    it("composes getters", () => {
        const l = lens<Required.User>()(
            u => u.address,
            (u, address) => ({ ...u, address })
        );

        const l2 = lens<Required.User["address"]>()(
            a => a.city,
            (a, city) => ({ ...a, city })
        );

        const l3 = l.compose(l2);

        const actual = l3.get(user);

        expect(actual).toBe(Required.refUser.address.city);
    });

    it("composes setters", () => {
        const l = lens<Required.User>()(
            u => u.address,
            (u, address) => ({ ...u, address })
        );

        const l2 = lens<Required.User["address"]>()(
            a => a.city,
            (a, city) => ({ ...a, city })
        );

        const l3 = l.compose(l2);

        const actual = l3.set(user, "Newcastle");

        expect(actual.address.city).toBe("Newcastle");
    });

    it("composes setters without mutation", () => {
        const l = lens<Required.User>()(
            u => u.address,
            (u, address) => ({ ...u, address })
        );

        const l2 = lens<Required.User["address"]>()(
            a => a.city,
            (a, city) => ({ ...a, city })
        );

        const l3 = l.compose(l2);

        l3.set(user, "Newcastle");

        expect(user.address.city).toBe(Required.refUser.address.city);
    });

    it("modifies using an updater", () => {
        const l = lens<Required.User>()(
            u => u.name,
            (u, name) => ({ ...u, name })
        );

        const updater = l.modify(n => n.toUpperCase());

        const actual = updater(user);

        expect(actual.name).toBe(Required.refUser.name.toUpperCase());
    });
});
