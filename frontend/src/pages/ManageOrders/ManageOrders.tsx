import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import type { OrdersResponse } from "../../data/types/OrderResponse";
import styles from "./ManageOrders.module.css";

const ManageOrders = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [statusFilter, setStatusFilter] = useState<string | undefined>(
        undefined,
    );
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const ordersQuery = useQuery<OrdersResponse, Error>({
        queryKey: ["orders", statusFilter],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const query = statusFilter ? `?status=${statusFilter}` : "";

            const res = await fetch(`http://localhost:3000/orders${query}`, {
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

    const updateStatusMutation = useMutation<
        OrdersResponse,
        Error,
        { orderId: number; status: string }
    >({
        mutationFn: async ({ orderId, status }) => {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:3000/orders/${orderId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                },
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["orders", statusFilter],
            });
        },
    });

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Manage Orders</h1>
            <div className={styles.filters_container}>
                <Button
                    onClick={() => setStatusFilter(undefined)}
                    className={`${styles.default_button} ${statusFilter === undefined ? "" : styles.inactive}`}
                    text="All Orders"
                />
                <Button
                    onClick={() => setStatusFilter("PENDING")}
                    className={`${styles.pending_button} ${statusFilter === "PENDING" ? "" : styles.inactive}`}
                    text="PENDING"
                />
                <Button
                    onClick={() => setStatusFilter("CONFIRMED")}
                    className={`${styles.confirmed_button} ${statusFilter === "CONFIRMED" ? "" : styles.inactive}`}
                    text="CONFIRMED"
                />
                <Button
                    onClick={() => setStatusFilter("SHIPPED")}
                    className={`${styles.shipped_button} ${statusFilter === "SHIPPED" ? "" : styles.inactive}`}
                    text="SHIPPED"
                />
                <Button
                    onClick={() => setStatusFilter("DELIVERED")}
                    className={`${styles.delivered_button} ${statusFilter === "DELIVERED" ? "" : styles.inactive}`}
                    text="DELIVERED"
                />
            </div>
            <article className={styles.orders_container}>
                {ordersQuery.isLoading ? <p>Loading...</p> : ""}
                {ordersQuery.isError ? <p>{ordersQuery.error.message}</p> : ""}

                {ordersQuery.isFetched &&
                    ordersQuery.data?.data.map((order) => {
                        const isExpanded = expandedOrderId === order.id;

                        return (
                            <div
                                key={order.id}
                                className={`${styles.order} ${isExpanded ? styles.expanded : ""}`}
                            >
                                <div className={styles.order_header}>
                                    <span className={styles.order_name}>
                                        Order #{order.id}
                                    </span>
                                    <span
                                        className={styles.toggle_icon}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedOrderId(
                                                isExpanded ? null : order.id,
                                            );
                                        }}
                                    >
                                        {isExpanded ? (
                                            <p className={styles.icon}>
                                                Collapse
                                                <FaChevronUp />
                                            </p>
                                        ) : (
                                            <p className={styles.icon}>
                                                Expand
                                                <FaChevronDown />
                                            </p>
                                        )}
                                    </span>

                                    <select
                                        value={order.status}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            updateStatusMutation.mutate({
                                                orderId: order.id,
                                                status: e.target.value,
                                            });
                                        }}
                                        className={`${styles.dropdown} ${
                                            order.status === "PENDING"
                                                ? styles.pending
                                                : order.status === "CONFIRMED"
                                                  ? styles.confirmed
                                                  : order.status === "SHIPPED"
                                                    ? styles.shipped
                                                    : order.status ===
                                                        "DELIVERED"
                                                      ? styles.delivered
                                                      : ""
                                        }`}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="CONFIRMED">
                                            CONFIRMED
                                        </option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">
                                            DELIVERED
                                        </option>
                                    </select>
                                </div>

                                {isExpanded && (
                                    <div className={styles.order_details}>
                                        <p className={styles.detail}>
                                            <strong>User:</strong>{" "}
                                            {order.user.name}
                                        </p>
                                        <p className={styles.detail}>
                                            <strong>Delivery: </strong>
                                            {order.deliveryAddress.street},{" "}
                                            {order.deliveryAddress.city}
                                        </p>
                                        <p className={styles.detail}>
                                            <strong>Billing: </strong>
                                            {order.billingAddress.street},{" "}
                                            {order.billingAddress.city}
                                        </p>
                                        <p className={styles.detail}>
                                            <strong>Total Price:</strong> $
                                            {order.totalPrice.toFixed(2)}
                                        </p>
                                        <p className={styles.detail}>
                                            <strong>Ordered At:</strong>{" "}
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleDateString()}
                                        </p>

                                        <p className={styles.detail}>
                                            <strong>Items:</strong>
                                        </p>
                                        <table className={styles.items_table}>
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Price</th>
                                                    <th>Size</th>
                                                    <th>Color</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            {item.productName}
                                                        </td>
                                                        <td>
                                                            $
                                                            {item.price.toFixed(
                                                                2,
                                                            )}
                                                        </td>
                                                        <td>{item.size}</td>
                                                        <td>{item.color}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </article>
            <Button onClick={() => navigate("/admin")} />
        </section>
    );
};

export default ManageOrders;
