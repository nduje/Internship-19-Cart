import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { FavoriteResponse } from "../../data/types/FavoriteResponse";
import styles from "./Favorites.module.css";

const Favorites = () => {
    const navigate = useNavigate();

    const favoritesQuery = useQuery<FavoriteResponse, Error>({
        queryKey: ["favorites"],
        queryFn: async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/favorites`, {
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

    const favorites = Array.isArray(favoritesQuery.data?.data)
        ? favoritesQuery.data.data
        : [];

    const products = favorites.map((fav) => fav.product);

    return (
        <section className={styles.container}>
            {favoritesQuery.isLoading && <p>Loading products...</p>}
            {favoritesQuery.isError && <p>Failed to load products.</p>}
            {!favoritesQuery.isLoading &&
                !favoritesQuery.isError &&
                products?.length === 0 && <p>No products found.</p>}

            <article className={styles.products}>
                {" "}
                {!favoritesQuery.isLoading &&
                    !favoritesQuery.isError &&
                    products?.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => navigate(`/products/${product.id}`)}
                            className={styles.product}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className={styles.product_image}
                            />
                            <h3 className={styles.product_name}>
                                {product.name}
                            </h3>
                            <p className={styles.product_category}>
                                {product.category?.name}
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
                    ))}
            </article>
        </section>
    );
};

export default Favorites;
