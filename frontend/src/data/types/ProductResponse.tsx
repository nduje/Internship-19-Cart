import type { Product } from "./Product";

export type ProductResponse = {
    statusCode: number;
    message: string;
    data: {
        items: Product[];
        total: number;
    };
};
