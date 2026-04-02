import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManageCategories.module.css";

type Products = {};

type Category = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    products: Products[];
};

type CategoriesResponse = {
    statusCode: number;
    message: string;
    data: Category[];
};

const ManageCategories = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isAddCategory, setIsAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const createMutation = useMutation({
        mutationFn: async (name: string) => {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3000/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            return res.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setNewCategoryName("");
            setIsAddCategory(false);
        },

        onError: (error: Error) => {
            alert(`Error: ${error.message}`);
        },
    });

    const handleCreateCategory = () => {
        if (!newCategoryName.trim()) {
            alert("Category name is required");
            return;
        }

        createMutation.mutate(newCategoryName);
    };

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

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/categories/${id}`, {
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
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },

        onError: (error: Error) => {
            alert(`Error: ${error.message}`);
        },
    });

    const handleDelete = (category: Category) => {
        const hasProducts = category.products && category.products.length > 0;

        let message = `Are you sure you want to delete ${category.name} category?`;

        if (hasProducts) {
            message = `Category ${category.name} has connected products. Do you want to proceed?`;
        }

        if (window.confirm(message)) {
            deleteMutation.mutate(category.id);
        }
    };

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Manage Categories</h1>
            <button
                type="button"
                onClick={() => {
                    setIsAddCategory((prev) => !prev);
                }}
                className={styles.button}
            >
                {isAddCategory ? "Close" : "Add Category"}
            </button>
            {isAddCategory ? (
                <div className={styles.add_category_container}>
                    <input
                        type="text"
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className={styles.input}
                    />

                    <button
                        onClick={handleCreateCategory}
                        disabled={createMutation.isPending}
                        className={styles.add_button}
                    >
                        {createMutation.isPending ? "Adding..." : "Add"}
                    </button>
                </div>
            ) : (
                ""
            )}
            <article className={styles.categories_container}>
                {categoriesQuery.isLoading ? <p>Loading...</p> : ""}
                {categoriesQuery.isError ? (
                    <p>{categoriesQuery.error.message}</p>
                ) : (
                    ""
                )}
                {categoriesQuery.isFetched
                    ? categoriesQuery.data?.data.map((category) => (
                          <div key={category.id} className={styles.category}>
                              <span className={styles.category_name}>
                                  {category.name}
                              </span>
                              <button
                                  onClick={() => handleDelete(category)}
                                  className={styles.delete_button}
                                  disabled={deleteMutation.isPending}
                              >
                                  Delete
                              </button>
                          </div>
                      ))
                    : ""}
            </article>
            <button
                type="button"
                onClick={() => navigate(-1)}
                className={styles.button}
            >
                Go Back
            </button>
        </section>
    );
};

export default ManageCategories;
