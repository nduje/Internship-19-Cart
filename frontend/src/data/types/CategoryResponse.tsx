import type { Category } from "./Category";

export type CategoriesResponse = {
    statusCode: number;
    message: string;
    data: Category[];
};
