import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./EditProduct.module.css";

const SIZE_OPTIONS = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "EU_40",
    "EU_41",
    "EU_42",
    "EU_43",
    "EU_44",
    "EU_45",
    "EU_46",
];
const COLOR_OPTIONS = [
    "RED",
    "BLUE",
    "GREEN",
    "BLACK",
    "WHITE",
    "YELLOW",
    "ORANGE",
    "PURPLE",
    "PINK",
    "BROWN",
    "GRAY",
];

type Product = {
    name: string;
    description: string;
    price: number;
    brand: string;
    inStock: boolean;
    image: string;
    sizes: string[];
    colors: string[];
    categoryId: number;
};

type ProductResponse = {
    statusCode: number;
    message: string;
    data: Product;
};

type Category = {
    id: number;
    name: string;
};

type CategoriesResponse = {
    statusCode: number;
    message: string;
    data: Category[];
};

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
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

    const productQuery = useQuery<Product, Error>({
        queryKey: ["product", id],

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

            const data = await res.json();
            return data.data;
        },

        enabled: !!id,
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!productQuery.data) return;

        const product = productQuery.data;

        setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price || 0,
            brand: product.brand || "",
            inStock: product.inStock ?? true,
            image: product.image || "",
            sizes: product.sizes || [],
            colors: product.colors || [],
            categoryId: product.categoryId || 0,
        });
    }, [productQuery.data]);

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

    const updateProductMutation = useMutation<ProductResponse, Error, Product>({
        mutationFn: async (updatedProduct) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...updatedProduct,
                    sizes: updatedProduct.sizes,
                    colors: updatedProduct.colors,
                    image:
                        updatedProduct.image ||
                        "/src/assets/images/products/placeholder.svg",
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", id] });
            navigate("/admin/products");
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        updateProductMutation.mutate(form, {
            onSettled: () => setLoading(false),
        });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Edit Product</h2>

            <form
                id="edit-form"
                onSubmit={handleSubmit}
                className={styles.form}
            >
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
                        text={loading ? "Saving..." : "Save Changes"}
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

export default EditProduct;
