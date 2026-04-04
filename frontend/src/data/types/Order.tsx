import type { ProductItem } from "./ProductItem";

export type Order = {
    id: number;
    user: {
        name: string;
    };
    status: string;
    totalPrice: number;
    deliveryAddress: {
        street: string;
        city: string;
    };
    billingAddress: {
        street: string;
        city: string;
    };
    createdAt: string;
    items: ProductItem[];
};
