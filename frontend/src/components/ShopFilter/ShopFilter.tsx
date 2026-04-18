import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { CategoriesResponse } from "../../data/types/CategoryResponse";
import type { ShopFilterProps } from "../../data/types/ShopFilterProps";
import styles from "./ShopFilter.module.css";

const ShopFilter = ({
    search,
    setSearch,
    category,
    setCategory,
    loading,
}: ShopFilterProps) => {
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
                placeholder="Search for..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className={styles.searchbar}
            />

            <div className={styles.tag_list}>
                <span
                    className={`${styles.tag} ${category === "" ? styles.active : ""}`}
                    onClick={() => setCategory("")}
                >
                    All
                </span>

                {categoriesQuery.data?.data.map((cat) => (
                    <span
                        key={cat.id}
                        className={`${styles.tag} ${category === cat.name ? styles.active : ""}`}
                        onClick={() => setCategory(cat.name)}
                    >
                        {cat.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ShopFilter;
