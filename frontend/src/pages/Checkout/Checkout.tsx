import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import type { UsersResponse } from "../../data/types/UsersResponse";
import styles from "./Checkout.module.css";

const Checkout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const userId = localStorage.getItem("userId");
    const cartKey = `cart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

    const usersQuery = useQuery<UsersResponse, Error>({
        queryKey: ["users/me"],
        queryFn: async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3000/users/me", {
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

    const user = usersQuery.data?.data;

    const name = user?.name;

    const deliveryAddress = user?.addresses?.find(
        (addr) => addr.type === "DELIVERY",
    );
    const billingAddress = user?.addresses?.find(
        (addr) => addr.type === "BILLING",
    );

    const createMutation = useMutation({
        mutationFn: async () => {
            if (!cart.length) throw new Error("Cart is empty");

            const orderItems = cart.map((item: any) => ({
                productId: item.productId,
                size: item.size,
                color: item.color,
            }));

            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ items: orderItems }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            return res.json();
        },

        onSuccess: () => {
            localStorage.removeItem(cartKey);
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            navigate("/success");
        },

        onError: (error: Error) => {
            alert(`Error: ${error.message}`);
            navigate("/error");
        },
    });

    const handleOrder = () => {
        createMutation.mutate();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Checkout</h1>
            <div className={styles.address_container}>
                <div className={styles.header_container}>
                    <h2 className={styles.header_subtitle}>DELIVERY ADDRESS</h2>
                    <img
                        src="/src/assets/icons/truck.svg"
                        alt="truck"
                        className={styles.truck_icon}
                    />
                </div>
                <div className={styles.header_container}>
                    <h2 className={styles.header_subtitle}>Mailing Address</h2>
                    <Button
                        onClick={() => navigate("/profile/edit")}
                        text="Change"
                    />
                </div>
                <div className={styles.address_info_container}>
                    <p>{name}</p>
                    <p>{deliveryAddress?.street}</p>
                    <p>
                        {deliveryAddress?.city}, {deliveryAddress?.postalCode},{" "}
                        {deliveryAddress?.country}
                    </p>
                </div>
            </div>
            <div className={styles.address_container}>
                <div className={styles.header_container}>
                    <h2 className={styles.header_subtitle}>BILLING ADDRESS</h2>
                    <img
                        src="/src/assets/icons/truck.svg"
                        alt="truck"
                        className={styles.truck_icon}
                    />
                </div>
                <div className={styles.header_container}>
                    <h2 className={styles.header_subtitle}>Mailing Address</h2>
                    <Button
                        onClick={() => navigate("/profile/edit")}
                        text="Change"
                    />
                </div>
                <div className={styles.address_info_container}>
                    <p>{name}</p>
                    <p>{billingAddress?.street}</p>
                    <p>
                        {billingAddress?.city}, {billingAddress?.postalCode},{" "}
                        {billingAddress?.country}
                    </p>
                </div>
            </div>
            <button onClick={handleOrder} className={styles.button}>
                Order
            </button>
        </div>
    );
};

export default Checkout;
