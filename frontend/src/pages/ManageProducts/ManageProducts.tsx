import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./ManageProducts.module.css";

type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
};

type ProductsResponse = {
    statusCode: number;
    message: string;
    data: {
        items: Product[];
        total: number;
    };
};

const ManageProducts = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [categoriesFilter, setCategoriesFilter] = useState<
        string | undefined
    >(undefined);

    const productsQuery = useQuery<ProductsResponse, Error>({
        queryKey: ["products", categoriesFilter],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const query = categoriesFilter
                ? `?category=${categoriesFilter}`
                : "";

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
        if (
            window.confirm(`Are you sure you want to delete ${product.name}?`)
        ) {
            deleteMutation.mutate(product.id);
        }
    };

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Manage Products</h1>

            <article className={styles.products_container}>
                {productsQuery.isLoading && <p>Loading...</p>}
                {productsQuery.isError && <p>{productsQuery.error.message}</p>}

                {productsQuery.data?.data.items.map((product: any) => (
                    <div key={product.id} className={styles.product}>
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
                                {product.sizes.map((size: string) => (
                                    <span key={size} className={styles.tag}>
                                        {size}
                                    </span>
                                ))}
                            </div>
                            <div className={styles.tag_group}>
                                <strong>Colors:</strong>
                                {product.colors.map((color: string) => (
                                    <span key={color} className={styles.tag}>
                                        {color}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.status_actions}>
                            <span className={styles.price}>
                                {product.price}€
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

                            <div className={styles.actions}>
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
            </article>

            <div className={styles.buttons_container}>
                <Button onClick={() => navigate("/admin")} />
            </div>
        </section>
    );
};

export default ManageProducts;
