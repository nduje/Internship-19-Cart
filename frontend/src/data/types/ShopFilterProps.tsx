export type ShopFilterProps = {
    search: string;
    setSearch: (val: string) => void;
    category: string;
    setCategory: (val: string) => void;
    loading: boolean;
};
