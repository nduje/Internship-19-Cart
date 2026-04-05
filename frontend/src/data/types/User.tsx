import type { Address } from "./Address";
import type { Card } from "./Card";

export type User = {
    name?: string;
    email?: string;
    password?: string;
    addresses: Address[];
    card: Card;
};
