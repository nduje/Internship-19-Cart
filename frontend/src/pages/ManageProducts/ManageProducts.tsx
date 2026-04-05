import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Filter from "../../components/Filter/Filter";
import type { Product } from "../../data/types/Product";
import type { ProductResponse } from "../../data/types/ProductResponse";
import styles from "./ManageProducts.module.css";

const PRODUCTS_PER_PAGE = 6;

const ManageProducts = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string>("");
    const [sortBy, setSortBy] = useState("");
    const [inStock, setInStock] = useState<boolean | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState<Product[]>([]);

    const lastProductRef = useRef<HTMLDivElement>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const productsQuery = useQuery<ProductResponse, Error>({
        queryKey: [
            "products",
            { search, category, sortBy, inStock, page: currentPage },
        ],
        queryFn: async () => {
            const token = localStorage.getItem("token");

            const params = new URLSearchParams();

            if (search) params.append("search", search);
            if (category) params.append("category", String(category));
            if (sortBy) params.append("sort", sortBy);
            if (inStock !== undefined)
                params.append("inStock", String(inStock));

            params.append("page", String(currentPage));
            params.append("limit", String(PRODUCTS_PER_PAGE));

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

    useEffect(() => {
        if (productsQuery.data?.data.items) {
            setProducts((prev) =>
                currentPage === 1
                    ? productsQuery.data!.data.items
                    : [...prev, ...productsQuery.data!.data.items],
            );
        }
    }, [productsQuery.data]);

    useEffect(() => {
        setProducts([]);
        setCurrentPage(1);
    }, [search, category, sortBy, inStock]);

    useEffect(() => {
        if (productsQuery.isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting &&
                productsQuery.data &&
                products.length < productsQuery.data.data.total &&
                productsQuery.data.data.items.length > 0
            ) {
                setCurrentPage((prev) => prev + 1);
            }
        });

        if (lastProductRef.current)
            observer.current.observe(lastProductRef.current);

        return () => observer.current?.disconnect();
    }, [productsQuery.isLoading, productsQuery.data, products]);

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }
            return res.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },

        onError: (error: Error) => {
            alert(`Error: ${error.message}`);
        },
    });

    const handleDelete = (product: Product) => {
        if (!product.id) return;

        if (
            window.confirm(`Are you sure you want to delete ${product.name}?`)
        ) {
            deleteMutation.mutate(product.id);
        }
    };

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Manage Products</h1>

            <Button
                onClick={() => navigate("/admin/products/add")}
                text="Add Product"
            />

            <Filter
                search={search}
                setSearch={setSearch}
                sortBy={sortBy}
                setSortBy={setSortBy}
                category={category}
                setCategory={setCategory}
                inStock={inStock}
                setInStock={setInStock}
                loading={productsQuery.isLoading}
            />

            <article className={styles.products_container}>
                {productsQuery.isLoading && currentPage === 1 && (
                    <p>Loading...</p>
                )}
                {productsQuery.isError && <p>{productsQuery.error.message}</p>}

                {products.map((product) => (
                    <div key={product.id} className={styles.product}>
                        <div className={styles.product_image_container}>
                            <img
                                src={product.image}
                                className={styles.product_image}
                            />
                        </div>

                        <div className={styles.main_info}>
                            <h3 className={styles.product_name}>
                                {product.name}
                            </h3>
                            <p className={styles.brand_category}>
                                {product.brand} |{" "}
                                <strong>{product.category?.name}</strong>
                            </p>
                            <p className={styles.description}>
                                <strong>About: </strong>
                                {product.description}
                            </p>
                        </div>

                        <div className={styles.variants}>
                            <div className={styles.tag_group}>
                                <strong>Sizes:</strong>
                                {product.sizes.map((size) => (
                                    <span key={size} className={styles.tag}>
                                        {size}
                                    </span>
                                ))}
                            </div>
                            <div className={styles.tag_group}>
                                <strong>Colors:</strong>
                                {product.colors.map((color) => (
                                    <span key={color} className={styles.tag}>
                                        {color}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.status_actions}>
                            <span className={styles.price}>
                                {product.price.toFixed(2)}€
                            </span>
                            <span
                                className={
                                    product.inStock
                                        ? styles.in_stock
                                        : styles.out_of_stock
                                }
                            >
                                {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>

                            <div className={styles.buttons_container}>
                                <Button
                                    text="Edit"
                                    onClick={() =>
                                        navigate(
                                            `/admin/products/edit/${product.id}`,
                                        )
                                    }
                                    className={styles.edit_button}
                                />
                                <Button
                                    text="Delete"
                                    onClick={() => handleDelete(product)}
                                    className={styles.delete_button}
                                    disabled={deleteMutation.isPending}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div ref={lastProductRef} style={{ height: "10px" }} />

                {productsQuery.isFetching && currentPage > 1 && (
                    <p>Loading more...</p>
                )}
            </article>

            <Button onClick={() => navigate("/admin")} />
        </section>
    );
};

export default ManageProducts;
