import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { COLOR_OPTIONS } from "../../data/enums/Colors";
import { SIZE_OPTIONS } from "../../data/enums/Sizes";
import type { CategoriesResponse } from "../../data/types/CategoryResponse";
import type { Product } from "../../data/types/Product";
import styles from "./AddProduct.module.css";

const AddProduct = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [form, setForm] = useState<Product>({
        name: "",
        description: "",
        price: 0,
        brand: "",
        inStock: true,
        image: "",
        sizes: [],
        colors: [],
        categoryId: 0,
    });

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [loading, setLoading] = useState(false);

    const categoriesQuery = useQuery<CategoriesResponse, Error>({
        queryKey: ["categories"],

        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/categories", {
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

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type } = e.target;

        let finalValue: string | number | boolean = value;

        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            finalValue = e.target.checked;
        } else if (name === "price") {
            const val = parseFloat(value);
            finalValue = isNaN(val) || val < 0 ? 0 : val;
        } else if (name === "categoryId") {
            const val = parseInt(value);
            finalValue = isNaN(val) ? 0 : val;
        }

        setForm((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
    };

    const addSize = () => {
        if (!selectedSize || form.sizes.includes(selectedSize)) return;
        setForm((prev) => ({ ...prev, sizes: [...prev.sizes, selectedSize] }));
        setSelectedSize("");
    };

    const removeSize = (sizeToRemove: string) => {
        setForm((prev) => ({
            ...prev,
            sizes: prev.sizes.filter((size) => size !== sizeToRemove),
        }));
    };

    const addColor = () => {
        if (!selectedColor || form.colors.includes(selectedColor)) return;
        setForm((prev) => ({
            ...prev,
            colors: [...prev.colors, selectedColor],
        }));
        setSelectedColor("");
    };

    const removeColor = (colorToRemove: string) => {
        setForm((prev) => ({
            ...prev,
            colors: prev.colors.filter((color) => color !== colorToRemove),
        }));
    };

    const createMutation = useMutation({
        mutationFn: async (newProduct: Product) => {
            const token = localStorage.getItem("token");

            const { id, ...productData } = newProduct;

            const payload = {
                name: productData.name,
                description: productData.description,
                price: Number(productData.price),
                brand: productData.brand,
                inStock: Boolean(productData.inStock),
                image:
                    productData.image ||
                    "/src/assets/images/products/placeholder.svg",
                sizes: productData.sizes,
                colors: productData.colors,
                categoryId: Number(productData.categoryId),
            };

            const res = await fetch("http://localhost:3000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            return res.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            navigate("/admin/products");
        },

        onError: (error: Error) => {
            alert(`Error: ${error.message}`);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        createMutation.mutate(form, {
            onSettled: () => setLoading(false),
        });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Add Product</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.input_container}>
                    <label className={styles.label}>Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Name"
                        className={styles.input}
                    />
                </div>

                <div className={styles.input_container}>
                    <label className={styles.label}>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        placeholder="Description"
                        className={`${styles.input} ${styles.description}`}
                    />
                </div>

                <div className={styles.input_container}>
                    <label className={styles.label}>Price</label>
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                        placeholder="Price"
                        className={styles.input}
                    />
                </div>

                <div className={styles.input_container}>
                    <label className={styles.label}>Brand</label>
                    <input
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        required
                        placeholder="Brand"
                        className={styles.input}
                    />
                </div>

                <div className={styles.input_container}>
                    <label className={styles.label}>Image</label>
                    <input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className={styles.input}
                    />
                </div>

                <div className={styles.input_container}>
                    <label className={styles.label}>Category</label>
                    <select
                        name="categoryId"
                        value={form.categoryId || ""}
                        onChange={handleChange}
                        required
                        className={styles.dropdown}
                    >
                        <option value="">Select category</option>
                        {categoriesQuery.data?.data?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.input_container}>
                    <label className={styles.label}>Size</label>
                    <div className={styles.tag_container}>
                        <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className={styles.dropdown}
                        >
                            <option value="">Select size</option>
                            {SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <Button
                            type="button"
                            onClick={addSize}
                            text="Add Size"
                        />
                        <div className={styles.tag_list}>
                            {form.sizes.map((size) => (
                                <span
                                    key={size}
                                    className={styles.tag}
                                    onClick={() => removeSize(size)}
                                >
                                    {size} ✕
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.input_container}>
                    <label className={styles.label}>Colors</label>
                    <div className={styles.tag_container}>
                        <select
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className={styles.dropdown}
                        >
                            <option value="">Select color</option>
                            {COLOR_OPTIONS.map((color) => (
                                <option key={color} value={color}>
                                    {color}
                                </option>
                            ))}
                        </select>
                        <Button
                            type="button"
                            onClick={addColor}
                            text="Add Color"
                        />
                        <div className={styles.tag_list}>
                            {form.colors.map((color) => (
                                <span
                                    key={color}
                                    className={styles.tag}
                                    onClick={() => removeColor(color)}
                                >
                                    {color} ✕
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    className={`${styles.input_container} ${styles.in_stock_container}`}
                >
                    <label className={styles.label}>In stock: </label>
                    <label className={styles.in_stock_checkbox}>
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={form.inStock}
                            onChange={handleChange}
                        />
                        <div className={styles.custom_checkbox}></div>
                    </label>
                </div>

                <div className={styles.buttons_container}>
                    <Button
                        type="submit"
                        disabled={loading}
                        text={loading ? "Adding..." : "Add Product"}
                    />
                    <Button
                        type="button"
                        onClick={() => navigate(-1)}
                        text="Cancel"
                    />
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
