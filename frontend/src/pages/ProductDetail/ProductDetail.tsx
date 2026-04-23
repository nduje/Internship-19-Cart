import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import type { SingleProductResponse } from "../../data/types/SingleProductResponse";
import styles from "./ProductDetail.module.css";
import close from "/src/assets/icons/close.svg";
import emptyHeart from "/src/assets/icons/empty_heart.svg";
import fullHeart from "/src/assets/icons/full_heart.svg";

const ProductDetail = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isInCart, setIsInCart] = useState(false);

    const userId = localStorage.getItem("userId");
    const cartKey = `cart_${userId}`;

    const productQuery = useQuery<SingleProductResponse, Error>({
        queryKey: ["products", id],
        queryFn: async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:3000/products/${id}`, {
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

    const product = productQuery.data?.data;

    useEffect(() => {
        if (!product || !selectedColor || !selectedSize) {
            setIsInCart(false);
            return;
        }

        const cart = localStorage.getItem(cartKey);
        if (!cart) {
            setIsInCart(false);
            return;
        }

        const cartArray = JSON.parse(cart);

        const exists = cartArray.some(
            (item: any) =>
                item.productId === product.id &&
                item.size === selectedSize &&
                item.color === selectedColor,
        );

        setIsInCart(exists);
    }, [product, selectedColor, selectedSize]);

    useEffect(() => {
        if (product && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        }
    }, [product]);

    useEffect(() => {
        if (product?.sizes?.length) {
            setSelectedSize(product.sizes[0]);
        }
    }, [product]);

    const favoritesQuery = useQuery({
        queryKey: ["favorites"],
        queryFn: async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3000/favorites", {
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

        retry: false,
        refetchOnWindowFocus: false,
    });

    const createMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:3000/favorites/${product?.id}`,
                {
                    method: "POST",
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

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:3000/favorites/${product?.id}`,
                {
                    method: "DELETE",
                    headers: {
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

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
    });

    const handleFavoriteToggle = () => {
        if (!product) return;

        if (isFavorite) {
            deleteMutation.mutate();
        } else {
            createMutation.mutate();
        }
    };

    useEffect(() => {
        if (product && favoritesQuery.data?.data) {
            const isFav = favoritesQuery.data.data.some(
                (fav: any) => fav.productId === product.id,
            );

            setIsFavorite(isFav);
        }
    }, [product, favoritesQuery.data]);

    const handleCartToggle = () => {
        if (!product || !selectedColor || !selectedSize) return;

        const cart = localStorage.getItem(cartKey);
        let cartArray = cart ? JSON.parse(cart) : [];

        if (isInCart) {
            cartArray = cartArray.filter(
                (item: any) =>
                    !(
                        item.productId === product.id &&
                        item.size === selectedSize &&
                        item.color === selectedColor
                    ),
            );
        } else {
            window.dataLayer = window.dataLayer || [];

            window.dataLayer.push({
                event: "add_to_cart",
                product_id: product.id,
                product_name: product.name,
                price: product.price,
                category: product.category?.name || "unknown",
                color: selectedColor,
                size: selectedSize,
                page_url: window.location.href,
            });

            cartArray.push({
                productId: product.id,
                name: product.name,
                size: selectedSize,
                color: selectedColor,
                price: product.price,
            });
        }

        localStorage.setItem(cartKey, JSON.stringify(cartArray));

        setIsInCart(!isInCart);
    };

    return (
        <section className={styles.container}>
            {productQuery.isLoading && <p>Loading product...</p>}
            {productQuery.isError && <p>Failed to load product.</p>}
            {product && (
                <div className={styles.product}>
                    <div className={styles.product_image_container}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className={styles.product_image}
                        />
                    </div>
                    <h3 className={styles.product_name}>{product.name}</h3>
                    <p className={styles.product_price}>
                        {product.price.toFixed(2)}€
                    </p>

                    {product.colors.length > 1 && (
                        <div className={styles.colors_container}>
                            {product.colors.map((color) => {
                                const isSelected = selectedColor === color;
                                return (
                                    <span
                                        key={color}
                                        className={`${styles.color_circle} ${isSelected ? styles.active_color_circle : ""}`}
                                        style={{
                                            backgroundColor:
                                                color.toLowerCase(),
                                        }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {product.sizes.length > 0 && (
                        <div className={styles.sizes_wrapper}>
                            <label className={styles.sizes_text}>
                                Choose Size:
                            </label>
                            <div className={styles.sizes_container}>
                                {product.sizes.map((size) => {
                                    const isSelected = selectedSize === size;

                                    return (
                                        <span
                                            key={size}
                                            className={`${styles.size_box} ${isSelected ? styles.active_size_box : ""}`}
                                            onClick={() =>
                                                setSelectedSize(size)
                                            }
                                        >
                                            {size}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className={styles.buttons_container}>
                <Button
                    onClick={handleCartToggle}
                    text={isInCart ? "Remove from cart" : "Add to cart"}
                />
                <div
                    className={`${styles.button_container} ${isFavorite ? "" : styles.inactive}`}
                    onClick={handleFavoriteToggle}
                >
                    <img
                        src={isFavorite ? fullHeart : emptyHeart}
                        alt={isFavorite ? "full-heart" : "empty-heart"}
                        className={styles.icon}
                    />
                </div>
            </div>
            <div
                className={styles.button_container}
                onClick={() => navigate(-1)}
            >
                <img src={close} alt="close" className={styles.icon} />
            </div>
        </section>
    );
};

export default ProductDetail;
