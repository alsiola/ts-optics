/* eslint-disable @typescript-eslint/no-namespace */
/* istanbul ignore file */
export namespace Required {
    export interface User {
        id: string;
        name: string;
        address: {
            street: string;
            city: string;
        };
        friends: number[];
    }

    export const refUser: User = {
        id: "123",
        name: "Alex",
        address: {
            street: "Avenue Gardens",
            city: "Townborough"
        },
        friends: [0, 1, 2]
    };

    // Make sure we get a fresh copy of refUser so we can check for mutations
    export const getUser = (): User => JSON.parse(JSON.stringify(refUser));
}

export namespace Optional {
    export interface Address {
        street: string;
        city: string;
    }

    export interface User {
        id: string;
        name: string;
        address?: Address;
        friends: number[];
    }

    export const refUser: User = {
        id: "123",
        name: "Alex",
        friends: [0, 1, 2]
    };

    // Make sure we get a fresh copy of refUser so we can check for mutations
    export const getUser = (): User => JSON.parse(JSON.stringify(refUser));
}
