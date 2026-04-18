import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { CategoriesResponse } from "../../data/types/CategoryResponse";
import type { FilterProps } from "../../data/types/FilterProps";
import styles from "./Filter.module.css";

const Filter = ({
    search,
    setSearch,
    sortBy,
    setSortBy,
    category,
    setCategory,
    inStock,
    setInStock,
    loading,
}: FilterProps) => {
    const searchRef = useRef<HTMLInputElement>(null);
    const [localSearch, setLocalSearch] = useState(search);

    const categoriesQuery = useQuery<CategoriesResponse, Error>({
        queryKey: ["categories"],
        queryFn: async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("/api/categories", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            return res.json();
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!loading) {
            searchRef.current?.focus();
        }
    }, [loading]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(localSearch);
        }, 500);

        return () => clearTimeout(handler);
    }, [localSearch, setSearch]);

    return (
        <div className={styles.container}>
            <input
                type="search"
                ref={searchRef}
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className={styles.searchbar}
            />

            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.dropdown}
            >
                <option value="">Sort</option>
                <option value="price-asc">Price (Asc)</option>
                <option value="price-desc">Price (Desc)</option>
                <option value="name-asc">Name (Asc)</option>
                <option value="name-desc">Name (Desc)</option>
            </select>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.dropdown}
                disabled={categoriesQuery.isLoading || categoriesQuery.isError}
            >
                <option value="">All categories</option>
                {categoriesQuery.data?.data.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <select
                value={
                    inStock === undefined ? "all" : inStock ? "true" : "false"
                }
                onChange={(e) => {
                    const val = e.target.value;

                    if (val === "all") setInStock(undefined);
                    else if (val === "true") setInStock(true);
                    else setInStock(false);
                }}
                className={styles.dropdown}
            >
                <option value="all">All Stock</option>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
            </select>
        </div>
    );
};

export default Filter;
