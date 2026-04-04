import type { Product } from "./Product";

export type SingleProductResponse = {
    statusCode: number;
    message: string;
    data: Product;
};
