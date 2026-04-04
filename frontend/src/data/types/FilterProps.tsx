export type FilterProps = {
    search: string;
    setSearch: (val: string) => void;
    sortBy: string;
    setSortBy: (val: string) => void;
    category: string;
    setCategory: (val: string) => void;
    inStock: boolean | undefined;
    setInStock: (val: boolean | undefined) => void;
    loading: boolean;
};
