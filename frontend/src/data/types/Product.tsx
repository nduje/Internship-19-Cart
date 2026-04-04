export type Product = {
    id?: number | undefined;
    name: string;
    description: string;
    price: number;
    brand: string;
    inStock: boolean;
    image: string;
    sizes: string[];
    colors: string[];
    categoryId: number;
};
