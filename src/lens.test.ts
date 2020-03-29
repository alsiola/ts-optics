import { lens } from ".";
import { User, getUser, refUser } from "./__fixtures__/user";

describe("lens", () => {
    let user: User;

    beforeEach(() => {
        user = getUser();
    });

    it("gets a property", () => {
        const l = lens<User>()(
            u => u.name,
            (u, name) => ({ ...u, name })
        );

        const actual = l.get(user);

        expect(actual).toBe(refUser.name);
    });

    it("sets a property", () => {
        const l = lens<User>()(
            u => u.name,
            (u, name) => ({ ...u, name })
        );

        const actual = l.set(user, "Steve");

        expect(actual.name).toBe("Steve");
    });

    it("does not mutate when setting", () => {
        const l = lens<User>()(
            u => u.name,
            (u, name) => ({ ...u, name })
        );

        l.set(user, "Steve");

        expect(user.name).toBe(refUser.name);
    });

    it("composes getters", () => {
        const l = lens<User>()(
            u => u.address,
            (u, address) => ({ ...u, address })
        );

        const l2 = lens<User["address"]>()(
            a => a.city,
            (a, city) => ({ ...a, city })
        );

        const l3 = l.compose(l2);

        const actual = l3.get(user);

        expect(actual).toBe(refUser.address.city);
    });

    it("composes setters", () => {
        const l = lens<User>()(
            u => u.address,
            (u, address) => ({ ...u, address })
        );

        const l2 = lens<User["address"]>()(
            a => a.city,
            (a, city) => ({ ...a, city })
        );

        const l3 = l.compose(l2);

        const actual = l3.set(user, "Newcastle");

        expect(actual.address.city).toBe("Newcastle");
    });

    it("composes setters without mutation", () => {
        const l = lens<User>()(
            u => u.address,
            (u, address) => ({ ...u, address })
        );

        const l2 = lens<User["address"]>()(
            a => a.city,
            (a, city) => ({ ...a, city })
        );

        const l3 = l.compose(l2);

        l3.set(user, "Newcastle");

        expect(user.address.city).toBe(refUser.address.city);
    });

    it("modifies using an updater", () => {
        const l = lens<User>()(
            u => u.name,
            (u, name) => ({ ...u, name })
        );

        const updater = l.modify(n => n.toUpperCase());

        const actual = updater(user);

        expect(actual.name).toBe(refUser.name.toUpperCase());
    });
});
