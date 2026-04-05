import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopFilter from "../../components/ShopFilter/ShopFilter";
import type { FavoriteResponse } from "../../data/types/FavoriteResponse";
import type { ProductResponse } from "../../data/types/ProductResponse";
import styles from "./Search.module.css";
import heartIcon from "/src/assets/icons/indicator.svg";

const Search = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string>("");
    const navigate = useNavigate();

    const productsQuery = useQuery<ProductResponse, Error>({
        queryKey: ["products", { search, category }],
        queryFn: async () => {
            const token = localStorage.getItem("token");

            const params = new URLSearchParams();

            if (search) params.append("search", search);
            if (category) params.append("category", String(category));

            const query = params.toString() ? `?${params.toString()}` : "";

            const res = await fetch(`http://localhost:3000/products${query}`, {
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

    const favoritesQuery = useQuery<FavoriteResponse, Error>({
        queryKey: ["products"],
        queryFn: async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:3000/favorites`, {
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

    const products = productsQuery.data?.data.items;

    const favorites = Array.isArray(favoritesQuery.data?.data)
        ? favoritesQuery.data.data
        : [];

    const favoriteProducts = favorites.map((fav) => fav.product);
    const favoriteIds = new Set(favoriteProducts.map((p) => p.id));

    return (
        <section className={styles.container}>
            <ShopFilter
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                loading={productsQuery.isLoading}
            />
            <article className={styles.products}>
                {productsQuery.isLoading && <p>Loading products...</p>}
                {productsQuery.isError && <p>Failed to load products.</p>}
                {!productsQuery.isLoading &&
                    !productsQuery.isError &&
                    products?.length === 0 && <p>No products found.</p>}

                {!productsQuery.isLoading &&
                    !productsQuery.isError &&
                    products?.map((product) => {
                        const isFavorite = favoriteIds.has(product.id);

                        return (
                            <div
                                key={product.id}
                                onClick={() =>
                                    navigate(`/products/${product.id}`)
                                }
                                className={styles.product}
                            >
                                {isFavorite && (
                                    <div
                                        className={
                                            styles.favorite_icon_container
                                        }
                                    >
                                        <img
                                            src={heartIcon}
                                            alt="favorite"
                                            className={styles.favorite_icon}
                                        />
                                    </div>
                                )}

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={styles.product_image}
                                />
                                <h3 className={styles.product_name}>
                                    {product.name}
                                </h3>
                                <p className={styles.product_category}>
                                    {product.category.name}
                                </p>
                                <p className={styles.product_price}>
                                    {product.price.toFixed(2)}€
                                </p>
                                {product.colors.length > 1 && (
                                    <div className={styles.colors_container}>
                                        {product.colors.map((color) => (
                                            <span
                                                key={color}
                                                className={styles.color_circle}
                                                style={{
                                                    backgroundColor:
                                                        color.toLowerCase(),
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </article>
        </section>
    );
};

export default Search;
