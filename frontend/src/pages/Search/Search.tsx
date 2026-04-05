import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ShopFilter from "../../components/ShopFilter/ShopFilter";
import type { FavoriteResponse } from "../../data/types/FavoriteResponse";
import type { ProductResponse } from "../../data/types/ProductResponse";
import styles from "./Search.module.css";
import heartIcon from "/src/assets/icons/indicator.svg";

const PRODUCTS_PER_PAGE = 6;

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(
        () => searchParams.get("search") || "",
    );
    const [category, setCategory] = useState<string>(
        () => searchParams.get("category") || "",
    );

    const navigate = useNavigate();
    const lastProductRef = useRef<HTMLDivElement>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const productsQuery = useInfiniteQuery<ProductResponse, Error>({
        queryKey: ["products", { search, category }],
        queryFn: async ({ pageParam = 1 }) => {
            const token = localStorage.getItem("token");
            const params = new URLSearchParams();

            if (search) params.append("search", search);
            if (category) params.append("category", category);
            params.append("page", String(pageParam));
            params.append("limit", String(PRODUCTS_PER_PAGE));

            const res = await fetch(
                `http://localhost:3000/products?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }
            return res.json();
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { page, total, limit } = lastPage.data;
            return page * limit < total ? page + 1 : undefined;
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const favoritesQuery = useQuery<FavoriteResponse, Error>({
        queryKey: ["favorites"],
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

    const products =
        productsQuery.data?.pages.flatMap((page) => page.data.items) ?? [];

    const favorites = Array.isArray(favoritesQuery.data?.data)
        ? favoritesQuery.data.data
        : [];

    const favoriteIds = new Set(favorites.map((fav: any) => fav.product.id));

    useEffect(() => {
        if (
            productsQuery.isLoading ||
            productsQuery.isFetchingNextPage ||
            !productsQuery.hasNextPage
        )
            return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                productsQuery.fetchNextPage();
            }
        });

        if (lastProductRef.current) {
            observer.current.observe(lastProductRef.current);
        }

        return () => observer.current?.disconnect();
    }, [
        productsQuery.isLoading,
        productsQuery.isFetchingNextPage,
        productsQuery.hasNextPage,
        productsQuery.fetchNextPage,
    ]);

    useEffect(() => {
        const params: Record<string, string> = {};

        if (search) params.search = search;
        if (category) params.category = category;

        setSearchParams(params);
    }, [search, category]);

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
                    products.length === 0 && <p>No products found.</p>}

                {products.map((product) => {
                    const isFavorite = favoriteIds.has(product.id);

                    return (
                        <div
                            key={product.id}
                            onClick={() => navigate(`/products/${product.id}`)}
                            className={styles.product}
                        >
                            {isFavorite && (
                                <div className={styles.favorite_icon_container}>
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
                    );
                })}

                <div ref={lastProductRef} style={{ height: "10px" }} />

                {productsQuery.isFetchingNextPage && <p>Loading more...</p>}
            </article>
        </section>
    );
};

export default Search;
