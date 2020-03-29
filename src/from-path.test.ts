import { User, getUser, refUser } from "./__fixtures__/user";
import { fromPath } from "./from-path";

describe("fromPath", () => {
    let user: User;

    beforeEach(() => {
        user = getUser();
    });

    it("gets a property", () => {
        const l = fromPath<User>()("name");

        const actual = l.get(user);

        expect(actual).toBe(refUser.name);
    });

    it("sets a property", () => {
        const l = fromPath<User>()("name");

        const actual = l.set(user, "Steve");

        expect(actual.name).toBe("Steve");
    });

    it("does not mutate when setting", () => {
        const l = fromPath<User>()("name");

        l.set(user, "Steve");

        expect(user.name).toBe(refUser.name);
    });

    it("composes getters", () => {
        const l = fromPath<User>()("address", "city");

        const actual = l.get(user);

        expect(actual).toBe(refUser.address.city);
    });

    it("composes setters", () => {
        const l = fromPath<User>()("address", "city");

        const actual = l.set(user, "Newcastle");

        expect(actual.address.city).toBe("Newcastle");
    });

    it("composes setters without mutation", () => {
        const l = fromPath<User>()("address", "city");

        l.set(user, "Newcastle");

        expect(user.address.city).toBe(refUser.address.city);
    });

    it("modifies using an updater", () => {
        const l = fromPath<User>()("address", "city");

        const updater = l.modify(n => n.toUpperCase());

        const actual = updater(user);

        expect(actual.address.city).toBe(refUser.address.city.toUpperCase());
    });

    it("modifies a complex array prop", () => {
        interface T {
            xxx: Array<{
                bbb: number;
            }>;
        }

        const l = fromPath<T>()("xxx", 1, "bbb");

        const t: T = {
            xxx: [{ bbb: 123 }, { bbb: 456 }]
        };

        const actual = l.set(t, 999);

        expect(t.xxx[1].bbb).toBe(456);
        expect(actual.xxx[1].bbb).toBe(999);
    });
});
