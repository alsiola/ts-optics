import { Required } from "./__fixtures__/user";
import { fromProp } from "./from-prop";

describe("fromProp", () => {
    let user: Required.User;

    beforeEach(() => {
        user = Required.getUser();
    });

    it("gets a property", () => {
        const l = fromProp<Required.User>()("name");

        const actual = l.get(user);

        expect(actual).toBe(Required.refUser.name);
    });

    it("sets a property", () => {
        const l = fromProp<Required.User>()("name");

        const actual = l.set(user, "Steve");

        expect(actual.name).toBe("Steve");
    });

    it("does not mutate when setting", () => {
        const l = fromProp<Required.User>()("name");

        l.set(user, "Steve");

        expect(user.name).toBe(Required.refUser.name);
    });

    it("composes getters", () => {
        const l = fromProp<Required.User>()("address");

        const l2 = fromProp<Required.User["address"]>()("city");

        const l3 = l.compose(l2);

        const actual = l3.get(user);

        expect(actual).toBe(Required.refUser.address.city);
    });

    it("composes setters", () => {
        const l = fromProp<Required.User>()("address");

        const l2 = fromProp<Required.User["address"]>()("city");

        const l3 = l.compose(l2);

        const actual = l3.set(user, "Newcastle");

        expect(actual.address.city).toBe("Newcastle");
    });

    it("composes setters without mutation", () => {
        const l = fromProp<Required.User>()("address");

        const l2 = fromProp<Required.User["address"]>()("city");

        const l3 = l.compose(l2);

        l3.set(user, "Newcastle");

        expect(user.address.city).toBe(Required.refUser.address.city);
    });

    it("modifies using an updater", () => {
        const l = fromProp<Required.User>()("name");

        const updater = l.modify(n => n.toUpperCase());

        const actual = updater(user);

        expect(actual.name).toBe(Required.refUser.name.toUpperCase());
    });

    it("modifies an array element", () => {
        type T = string[];

        const l = fromProp<T>()(0);

        const t: T = ["hello", "there"];

        const actual = l.set(t, "goodbye");

        expect(actual).toEqual(["goodbye", "there"]);
    });
});
